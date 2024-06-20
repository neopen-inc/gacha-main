import { IconHome2 } from "../icons/home2";
import { IconProfile } from "../icons/profile";
import { IconWallet } from "../icons/wallet";
import { VerticalIconButton } from "./button/vertical-icon-button";

export function BottomNavigator() {
  return  <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        <VerticalIconButton icon={<IconHome2 />} label="ホーム" />
        <VerticalIconButton icon={<IconWallet />} label="Wallet" />
        <VerticalIconButton icon={<IconProfile />} label="マイページ" />
      </div>
  </div>
}
