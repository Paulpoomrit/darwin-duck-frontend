import styles from './stat-panel-component.module.scss';
import cx from 'classnames';

export interface StatPanelComponentProps {
    className?: string;
}

export const StatPanelComponent = ({ className }: StatPanelComponentProps) => {
    return <div className={styles.statspanelcomponent} />;
};
