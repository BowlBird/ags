import { css } from "src/services/css";

// definition of entry widget to enter your password and authenticate through
export const entryWidget = ({
  onUnlock,
  onError,
  width,
}: {
  onUnlock: () => void;
  onError: (any) => void;
  width: number;
}) =>
  Widget.Entry({
    css: css.minWidth({ width: width }),
    hpack: "center",
    xalign: 0.5,
    visibility: false,
    isFocus: true,
    placeholder_text: "Authenticating...",
    on_accept: (self) => {
      self.sensitive = false;
      Utils.authenticate(self.text ?? "")
        .then(() => {
          onUnlock();
        })
        .catch((e) => {
          onError(e);

          // reset field
          self.text = "";
          self.sensitive = true;
          self.grab_focus();
        });
    },
  }).on("realize", (entry) => entry.grab_focus());
