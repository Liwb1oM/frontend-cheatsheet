# Frontend Cheatsheet

Шпаргалка для початківців-frontend розробників: **HTML, CSS, Tailwind, JavaScript, TypeScript, React** та Git/інструменти.
Кожна тема має коротке пояснення, приклад коду з кнопкою «Копіювати» і поради.

A beginner-friendly frontend cheatsheet: **HTML, CSS, Tailwind, JavaScript, TypeScript, React** plus Git/tooling.
Every topic has a short explanation, a copyable code example and tips.

## Можливості / Features

- Українська та English з перемикачем (вибір запам'ятовується)
- Пошук по всіх темах (шукає в обох мовах)
- Світла й темна теми
- PWA: можна встановити й користуватись офлайн
- Без збірки й залежностей: чистий HTML/CSS/JS

## Запуск локально / Run locally

Потрібен будь-який статичний сервер (service worker не працює через `file://`):

```bash
python3 -m http.server 8000
# або
npx serve .
```

Відкрийте http://localhost:8000

## Публікація на GitHub Pages / Deploy

1. Створіть репозиторій і запуште цей проєкт у гілку `main`.
2. У репозиторії: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Кожен push у `main` запускає `.github/workflows/pages.yml` і публікує сайт.

Усі шляхи відносні, тому сайт працює і в підпапці `https://user.github.io/repo/`.

## Структура / Structure

```
├── index.html
├── manifest.webmanifest      # PWA
├── sw.js                     # service worker (офлайн)
├── css/styles.css
├── icons/
└── js/
    ├── app.js                # рендер, пошук, тема, маршрути
    ├── i18n.js               # переклади інтерфейсу UK/EN
    ├── highlight.js          # підсвітка коду
    └── data/                 # КОНТЕНТ: по файлу на розділ
        ├── html.js
        ├── css.js
        ├── tailwind.js
        ├── javascript.js
        ├── typescript.js
        ├── react.js
        └── tools.js
```

## Як додати нову тему / How to add a topic

Відкрийте потрібний файл у `js/data/` і додайте об'єкт у масив `items`:

```js
{
  id: "my-topic",                       // унікальний у межах розділу, для посилань #css/my-topic
  title: { uk: "Назва", en: "Title" },
  text:  { uk: "Пояснення з `кодом` у зворотних лапках", en: "Explanation with `inline code`" },
  code:  { lang: "css", file: "styles.css", src: `a { color: red; }` },  // lang: html css js ts jsx tsx sh json text
  tip:   { uk: "Порада", en: "Tip" },   // необов'язково
  warn:  { uk: "Увага", en: "Careful" } // необов'язково
}
```

Якщо в прикладі коду є зворотні лапки або `${`, екрануйте їх: `` \` `` та `\${`.

## Як додати новий розділ / How to add a section

1. Створіть `js/data/my-section.js` за зразком інших (поля `id`, `icon`, `title`, `intro`, `items`).
2. Додайте `<script src="./js/data/my-section.js"></script>` в `index.html` (порядок скриптів = порядок вкладок).
3. Додайте файл у список `ASSETS` у `sw.js`.

## Оновлення й офлайн-кеш

Service worker віддає файли з кешу миттєво й оновлює їх у фоні. Після змін **збільште `VERSION` у `sw.js`** (наприклад, `v1` → `v2`), щоб користувачі гарантовано отримали нову версію.

## Міграція на React + TypeScript (за бажання)

Контент у `js/data/*.js` — звичайні дані. Їх можна перенести в `src/data/*.ts` без змін у структурі й відрендерити React-компонентами.
