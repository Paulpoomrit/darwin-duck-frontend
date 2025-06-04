import styles from './to-do-list-component.module.scss';
import cx from 'classnames';

export interface ToDoListComponentProps {
    className?: string;
}

export const ToDoListComponent = ({ className }: ToDoListComponentProps) => {
    return <div className={styles.todolistcomponent} />;
};
