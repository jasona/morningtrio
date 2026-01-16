import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './TaskItem';
import type { Task } from '@/types/task';

const mockTask: Task = {
  id: 'test-1',
  text: 'Test task',
  completed: false,
  section: 'other',
  orderIndex: 0,
  createdDate: '2026-01-15',
};

const mockCompletedTask: Task = {
  ...mockTask,
  id: 'test-2',
  completed: true,
};

describe('TaskItem', () => {
  it('renders task text', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('shows unchecked checkbox for incomplete task', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('shows checked checkbox for completed task', () => {
    render(
      <TaskItem
        task={mockCompletedTask}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onToggleComplete when checkbox is clicked', async () => {
    const onToggleComplete = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={onToggleComplete}
        onDelete={jest.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(onToggleComplete).toHaveBeenCalledWith('test-1');
  });

  it('calls onDelete when delete is confirmed', async () => {
    const onDelete = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={jest.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete task/i });
    await userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: /^delete$/i });
    await userEvent.click(confirmButton);

    expect(onDelete).toHaveBeenCalledWith('test-1');
  });

  it('applies strikethrough style to completed task', () => {
    render(
      <TaskItem
        task={mockCompletedTask}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const taskText = screen.getByText('Test task');
    expect(taskText).toHaveClass('line-through');
  });

  it('has drag handle button', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /drag to reorder/i })).toBeInTheDocument();
  });
});
