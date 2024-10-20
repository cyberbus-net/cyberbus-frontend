import { isBrowser } from "@utils/browser";
import { ThemeColor } from "@utils/types";
import Toastify from "toastify-js";
import { I18NextService } from "./services";

export function toast(text: string, background: ThemeColor = "success") {
  if (isBrowser()) {
    const backgroundColor = `var(--bs-${background})`;
    Toastify({
      text: text,
      backgroundColor: backgroundColor,
      gravity: "bottom",
      position: "left",
      duration: 5000,
      style: {
        borderRadius: "0.5rem",
      },
    }).showToast();
  }
}

export function pictrsDeleteToast(filename: string, deleteUrl: string) {
  if (isBrowser()) {
    const clickToDeleteText = I18NextService.i18n.t("click_to_delete_picture", {
      filename,
    });
    const deletePictureText = I18NextService.i18n.t("picture_deleted", {
      filename,
    });
    const failedDeletePictureText = I18NextService.i18n.t(
      "failed_to_delete_picture",
      {
        filename,
      },
    );

    const toast = Toastify({
      text: clickToDeleteText,
      backgroundColor: "#6F42C1",
      gravity: "top",
      position: "right",
      duration: 10000,
      style: {
        background: "#6F42C1",
        borderRadius: "0.5rem",
        color: "#FFFFFF",
      },
      onClick: () => {
        if (toast) {
          fetch(deleteUrl).then(res => {
            toast.hideToast();
            if (res.ok === true) {
              alert(deletePictureText);
            } else {
              alert(failedDeletePictureText);
            }
          });
        }
      },
      close: true,
    });

    toast.showToast();
  }
}
