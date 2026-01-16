import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskInput } from './TaskInput';

describe('TaskInput', () => {
  it('renders input field and add button', () => {
    render(<TaskInput onAddTask={jest.fn()} />);

    expect(screen.getByPlaceholderText('Add a task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls onAddTask when Enter is pressed with text', async () => {
    const onAddTask = jest.fn();
    render(<TaskInput onAddTask={onAddTask} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await userEvent.type(input, 'New task{enter}');

    expect(onAddTask).toHaveBeenCalledWith('New task');
  });

  it('clears input after submission', async () => {
    render(<TaskInput onAddTask={jest.fn()} />);

    const input = screen.getByPlaceholderText('Add a task...') as HTMLInputElement;
    await userEvent.type(input, 'New task{enter}');

    expect(input.value).toBe('');
  });

  it('does not submit empty or whitespace-only text', async () => {
    const onAddTask = jest.fn();
    render(<TaskInput onAddTask={onAddTask} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await userEvent.type(input, '   {enter}');

    expect(onAddTask).not.toHaveBeenCalled();
  });

  it('disables button when input is empty', () => {
    render(<TaskInput onAddTask={jest.fn()} />);

    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).toBeDisabled();
  });

  it('enables button when input has text', async () => {
    render(<TaskInput onAddTask={jest.fn()} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await userEvent.type(input, 'Some text');

    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).not.toBeDisabled();
  });

  it('submits when add button is clicked', async () => {
    const onAddTask = jest.fn();
    render(<TaskInput onAddTask={onAddTask} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await userEvent.type(input, 'Click submit');

    const button = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(button);

    expect(onAddTask).toHaveBeenCalledWith('Click submit');
  });
});
