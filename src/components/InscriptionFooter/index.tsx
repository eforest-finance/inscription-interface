import moment from 'moment';
import styles from './styles.module.css';
export function InscriptionFooter() {
  return <div className={styles.Inscription__footer}>{`AELF Inscription@${moment().year()}`}</div>;
}
