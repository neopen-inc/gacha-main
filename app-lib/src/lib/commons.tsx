import styles from './commons.module.css';

/* eslint-disable-next-line */
export interface CommonsProps {}

export function Commons(props: CommonsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Commons!</h1>
    </div>
  );
}

export default Commons;
