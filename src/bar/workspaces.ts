import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import { IconFromClass } from "src/services/functions";

function Window(client) {
  console.log(`Creating Window: ${client.class}`);
  return Widget.EventBox({
    child: Widget.Button({
      on_clicked: () =>
        Hyprland.sendMessage(`dispatch focuswindow title:${client.title}`),
      child: Widget.Box({
        class_name: `client-box`,
        children: [
          Widget.Icon({
            setup: (self) =>
              IconFromClass(client.initialClass).then(
                (icon) => (self.icon = icon)
              ),
            size: 20,
          }),
          Widget.Revealer({
            reveal_child: Hyprland.active.client
              .bind("address")
              .transform((address) => address == client.address),
            transition_duration: 400,
            transition: "slide_right",
            child: Widget.Label({
              label: `${client.title}`,
              class_name: "client-text",
            }),
          }),
        ],
      }),
      class_name: Hyprland.active.client
        .bind("address")
        .transform((address) => (address == client.address ? "focused" : "")),
    }),
    on_hover: (self) => (self.child.child.children[1].reveal_child = true),
    on_hover_lost: (self) => {
      if (Hyprland.active.client.address != client.address)
        self.child.child.children[1].reveal_child = false;
    },
  });
}

function ClientsChildren(workspace) {
  console.log(`Creating Children of Workspace: ${workspace}`);
  return Hyprland.clients
    .filter((client) => client.class != "" && client.workspace.id == workspace)
    .sort((a, b) => a.pid - b.pid)
    .map((client) => Window(client));
}
function workspaces() {
  return Hyprland.workspaces
    .sort((a, b) => a.id - b.id)
    .map(({ id }) =>
      Widget.Box({
        class_name: "workspace",
        children: [
          Widget.Button({
            on_clicked: () => Hyprland.sendMessage(`dispatch workspace ${id}`),
            child: Widget.Label(`${id}`),
            class_name: Hyprland.active.workspace
              .bind("id")
              .transform((i) => `${i === id ? "focused" : ""}`),
          }),
          Widget.Box({
            class_name: "clients",
            setup: (self) => {
              self.children = ClientsChildren(id);
            },
          }),
        ],
      })
    );
}

export const Workspaces = () =>
  Widget.Box({
    class_name: "workspaces",
    setup: (self) => {
      const update = () => (self.children = workspaces());
      Utils.timeout(100, update);

      Hyprland.connect("workspace-added", update);
      Hyprland.connect("workspace-removed", update);
      Hyprland.connect("notify::clients", update);
    },
  });
