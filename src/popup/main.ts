import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Popup root element not found');
}

const main = document.createElement('main');
const title = document.createElement('h1');
const description = document.createElement('p');

title.textContent = 'C:V';
description.textContent = 'TypeScript bootstrap is ready.';
main.append(title, description);
app.replaceChildren(main);
