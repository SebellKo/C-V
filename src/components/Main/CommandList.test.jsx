import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CommandList from './CommandList';
import useGetListByName from '../../hooks/useGetListByName';
import { useListStore } from '../../stores/ListStore';
import useCommandStore from '../../stores/CommandStore';
import { useEditCommandModalStore } from '../../stores/ModalStore';
import deleteCommand from '../../api/deleteCommand';
import putEditCommands from '../../api/putEditCommands';

const mockQueryResults = {};
const mockDrag = { active: '', over: '' };

jest.mock('../../hooks/useGetListByName');
jest.mock('../../api/deleteCommand');
jest.mock('../../api/putEditCommands');
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragStart, onDragEnd }) => (
    <div>
      {children}
      <button onClick={() => onDragStart({ active: { id: mockDrag.active } })}>
        Start drag
      </button>
      <button onClick={() => onDragEnd({ over: { id: mockDrag.over } })}>
        End drag
      </button>
    </div>
  ),
}));
jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => children,
  arrayMove: (items, from, to) => {
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(from, 1);
    reorderedItems.splice(to, 0, movedItem);
    return reorderedItems;
  },
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    setActivatorNodeRef: jest.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));
jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

describe('CommandList', () => {
  beforeEach(() => {
    Object.keys(mockQueryResults).forEach((key) => delete mockQueryResults[key]);
    useGetListByName.mockImplementation(
      (listName) =>
        mockQueryResults[listName] ?? { list: undefined, isSuccess: false },
    );
    deleteCommand.mockResolvedValue({ success: true });
    putEditCommands.mockResolvedValue({ success: true });
    useListStore.setState({ currentListName: 'Select' });
    useCommandStore.setState({ selectedCommand: '' });
    useEditCommandModalStore.setState({ isOpen: false });
    jest.clearAllMocks();
  });

  it('새 리스트를 불러오는 동안 이전 리스트의 수정 액션을 차단한다', async () => {
    // Given
    mockQueryResults.A = loadedList('A', ['A command 1', 'A command 2']);
    mockQueryResults.B = pendingList();
    mockDrag.active = 'A command 1';
    mockDrag.over = 'A command 2';
    const view = renderCommandList('A');
    expect(await screen.findByText('A command 1')).toBeInTheDocument();

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Start drag' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select B' }));

    // Then
    expect(screen.queryByText('A command 1')).not.toBeInTheDocument();
    expect(screen.queryByAltText('close icon')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'End drag' }));
    expect(putEditCommands).not.toHaveBeenCalled();
    expect(useEditCommandModalStore.getState().isOpen).toBe(false);

    // When
    mockQueryResults.B = loadedList('B', ['B command 1', 'B command 2']);
    view.rerender();
    expect(await screen.findByText('B command 1')).toBeInTheDocument();
    fireEvent.click(screen.getAllByAltText('close icon')[0]);
    fireEvent.click(screen.getByText('B command 1'));
    mockDrag.active = 'B command 1';
    mockDrag.over = 'B command 2';
    fireEvent.click(screen.getByRole('button', { name: 'Start drag' }));
    fireEvent.click(screen.getByRole('button', { name: 'End drag' }));

    // Then
    await waitFor(() =>
      expect(deleteCommand).toHaveBeenCalledWith('B', 'B command 1'),
    );
    await waitFor(() =>
      expect(putEditCommands).toHaveBeenCalledWith('B', [
        'B command 2',
        'B command 1',
      ]),
    );
    expect(useCommandStore.getState().selectedCommand).toBe('B command 1');
    expect(useEditCommandModalStore.getState().isOpen).toBe(true);
  });

  it('조회 실패와 빠른 A에서 B에서 C 전환에도 마지막 리스트만 표시한다', async () => {
    // Given
    mockQueryResults.A = loadedList('A', ['A command']);
    mockQueryResults.B = pendingList();
    mockQueryResults.C = pendingList();
    const view = renderCommandList('A');
    expect(await screen.findByText('A command')).toBeInTheDocument();

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Select B' }));
    mockQueryResults.B = failedList();
    view.rerender();

    // Then
    expect(screen.queryByText('A command')).not.toBeInTheDocument();
    expect(screen.queryByAltText('close icon')).not.toBeInTheDocument();

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Select A' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select B' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select C' }));
    mockQueryResults.B = loadedList('B', ['late B command']);
    view.rerender();

    // Then
    expect(screen.queryByText('late B command')).not.toBeInTheDocument();
    expect(screen.queryByText('A command')).not.toBeInTheDocument();

    // When
    mockQueryResults.C = loadedList('C', ['C command']);
    view.rerender();

    // Then
    expect(await screen.findByText('C command')).toBeInTheDocument();
    expect(screen.queryByText('late B command')).not.toBeInTheDocument();
  });

  it('순서 변경 저장에 실패하면 사용자가 보던 순서로 되돌린다', async () => {
    // Given
    let rejectReorder;
    putEditCommands.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectReorder = reject;
        }),
    );
    mockQueryResults.A = loadedList('A', ['A command 1', 'A command 2']);
    mockDrag.active = 'A command 1';
    mockDrag.over = 'A command 2';
    renderCommandList('A');
    expect(await screen.findByText('A command 1')).toBeInTheDocument();

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Start drag' }));
    fireEvent.click(screen.getByRole('button', { name: 'End drag' }));

    // Then
    expect(displayedCommands('A')).toEqual(['A command 2', 'A command 1']);
    await waitFor(() => expect(putEditCommands).toHaveBeenCalled());

    // When
    await act(async () => rejectReorder(new Error('save failed')));

    // Then
    await waitFor(() =>
      expect(displayedCommands('A')).toEqual(['A command 1', 'A command 2']),
    );
  });
});

function TestApp() {
  const setListName = useListStore((state) => state.setListName);

  return (
    <>
      {['A', 'B', 'C'].map((listName) => (
        <button key={listName} onClick={() => setListName(listName)}>
          Select {listName}
        </button>
      ))}
      <CommandList />
    </>
  );
}

function renderCommandList(initialListName) {
  useListStore.setState({ currentListName: initialListName });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const view = render(
    <QueryClientProvider client={queryClient}>
      <TestApp />
    </QueryClientProvider>,
  );

  return {
    ...view,
    rerender: () =>
      view.rerender(
        <QueryClientProvider client={queryClient}>
          <TestApp />
        </QueryClientProvider>,
      ),
  };
}

function loadedList(name, commands) {
  return { list: { name, commands }, isSuccess: true };
}

function pendingList() {
  return { list: undefined, isSuccess: false };
}

function failedList() {
  return { list: undefined, isSuccess: false, isError: true };
}

function displayedCommands(listName) {
  return screen
    .getAllByText(new RegExp(`^${listName} command`))
    .map((element) => element.textContent);
}
