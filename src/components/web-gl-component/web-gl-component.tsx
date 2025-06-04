import styles from './web-gl-component.module.scss';
import cx from 'classnames';

export interface WebGLComponentProps {
    className?: string;
}

export const WebGLComponent = ({ className }: WebGLComponentProps) => {
    return (<div className={styles.webglcomponent} />);
};
