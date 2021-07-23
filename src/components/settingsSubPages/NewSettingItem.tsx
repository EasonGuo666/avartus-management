import "../../styles/SettingsPage.css";
import { SettingsHeaderBar } from "./SettingsHeaderBar";

const NewSettingItem = () => {
  return (
    <div>
      <SettingsHeaderBar />
      <div className='body-form'>new setting item</div>
    </div>
  );
};

export { NewSettingItem };
