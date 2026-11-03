import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import FAQs from './FAQs';

const renderFaqs = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <FAQs />
      </MemoryRouter>
    </HelmetProvider>
  );

const question = (name: RegExp) => screen.getByRole('button', { name });

test('all questions start closed', () => {
  renderFaqs();
  expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(16);
  expect(screen.queryAllByRole('button', { expanded: true })).toHaveLength(0);
});

test('opening a question closes the one that was open', () => {
  renderFaqs();
  const deposit = question(/do i need a deposit/i);
  const parking = question(/where do i park/i);

  fireEvent.click(deposit);
  expect(deposit).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(parking);
  expect(parking).toHaveAttribute('aria-expanded', 'true');
  expect(deposit).toHaveAttribute('aria-expanded', 'false');
});

test('clicking an open question closes it', () => {
  renderFaqs();
  const deposit = question(/do i need a deposit/i);
  fireEvent.click(deposit);
  fireEvent.click(deposit);
  expect(deposit).toHaveAttribute('aria-expanded', 'false');
});

test('closed answers are hidden from keyboard and screen readers', () => {
  renderFaqs();
  const deposit = question(/do i need a deposit/i);
  const panel = document.getElementById(deposit.getAttribute('aria-controls')!)!;
  expect(panel).toHaveAttribute('inert');
  fireEvent.click(deposit);
  expect(panel).not.toHaveAttribute('inert');
});
