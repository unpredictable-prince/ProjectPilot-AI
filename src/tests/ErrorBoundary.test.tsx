import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const ProblemChild: React.FC = () => {
  throw new Error('Test rendering crash');
};

describe('ErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Component Output</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component Output')).toBeDefined();
  });

  it('renders fallback error state when a child component throws', () => {
    // Suppress console.error log spam during deliberate test crash
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(screen.getByText('Try Again')).toBeDefined();

    spy.mockRestore();
  });
});
