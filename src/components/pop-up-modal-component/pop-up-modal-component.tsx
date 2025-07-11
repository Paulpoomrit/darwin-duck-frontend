import styles from './pop-up-modal-component.module.scss';
import cx from 'classnames';
import PopupbgPng from '../../assets/img/popupbg.png';
import Exitbutton1Png from '../../assets/img/exitbutton 1.png';

export interface PopUpModalComponentProps {
    className?: string;
}

export const PopUpModalComponent = ({ className }: PopUpModalComponentProps) => {
    return (
        <div className={styles.popupbg1Parent}>
            <img className={styles.popupbg1Icon} alt="" src={PopupbgPng} />
            <div className={styles.sorryThisPart}>
                Sorry, this part of the application is still under construction.
            </div>
            <div className={styles.quackQuack}>
                <p className={styles.quackQuack1}>{`Quack Quack! `}</p>
            </div>
            <img className={styles.exitbutton1Icon} alt="" src={Exitbutton1Png} />
        </div>
    );
};
