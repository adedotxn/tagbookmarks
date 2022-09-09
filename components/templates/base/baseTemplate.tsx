import styles from "../../../styles/baseTemplate.module.css";

export interface IBaseTemplate {}

const BaseTemplate: React.FC<IBaseTemplate> = () => {
  return <div className={styles.container}>Hello world!</div>;
};

export default BaseTemplate;
