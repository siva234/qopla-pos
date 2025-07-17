# POS Modification & Addon UI

This project is a modern, unified user interface for selecting product modifications and addons in a Point of Sale (POS) system. It was built as a solution aiming to replace a disjointed, multi-step process with a single, intuitive screen. The goal is to improve the speed and experience for cashiers while creating opportunities for upselling.

The application is built with **React**, **TypeScript**, and **Vite**, and styled with **Tailwind CSS V4**.

## Technical Highlights & Architecture

This project was built with a focus on creating a clean, scalable, and maintainable codebase.

-   **State Management**: Centralized state management is handled using **React's Context API**. This avoids prop drilling and separates the application's business logic (state updates, price calculations, limit enforcement) from the presentational components.
-   **Component-Based Architecture**: The UI is broken down into small, reusable, and self-contained components (`ModificationSelector`, `AddonSelector`, `PriceDisplay`, etc.).
-   **Styling**: All styling is done with **Tailwind CSS**, eliminating the need for separate CSS files.
-   **Error Handling**: The application is wrapped in a custom **Error Boundary** component to catch any runtime rendering errors and display a fallback UI.
-   **Testable Utilities**: Critical business logic, such as the price calculation, has been extracted into pure, testable utility functions.

## Running
- **See the Project directly**: Use this URL to directly access the demo deployed onto Vercel [link](https://qopla-pos-sdpo.vercel.app/).
- **Running Locally**: Run the following scripts in the same order to see a demo on your localhost

```bash
npm install

npm dev
```

## Testing

A targeted testing strategy was implemented to ensure the most critical parts of the application are stable and reliable.

The project uses **Vitest** for the test runner and **React Testing Library** for rendering components and simulating user interactions.

-   **Unit Tests**: The core price calculation logic is covered by unit tests to verify its correctness against various combinations of inputs.
-   **Integration Tests**: The `AddonSelector` component has integration tests that simulate user clicks to ensure that addon limits (both item and group) are correctly enforced in the UI.

To run the tests, use the following command:

```bash
npm test
```
