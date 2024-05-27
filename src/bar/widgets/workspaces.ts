import { css } from "src/services/css";
import { IconFromClass } from "src/services/functions";
import { transitionContainer } from "src/widgets/transitionContainer";
import { Client, Workspace } from "types/service/hyprland";
import { Binding } from "types/types/service";

interface IconClient {
  icon: string;
  client: Client;
}

export const workspacesWidget = async ({
  animationDuration,
  spacing,
  iconSize,
  height,
}: {
  animationDuration: number;
  spacing: number;
  iconSize: number;
  height: number;
}) => {
  const submap = Variable("N", {
    listen: [
      App.configDir + "/src/services/submap.sh",
      (it) => {
        if (it === "submap>>command") return "C";
        else "N";
      },
    ],
  });
  const hyprland = await Service.import("hyprland");
  const iconClients = Variable<IconClient[]>([]);
  const workspaces = Utils.merge(
    [iconClients.bind(), hyprland.active.workspace.bind("id")],
    (clients, active) => {
      const initial = {};
      initial[active] = [];
      return clients.reduce((accumulator, client) => {
        (accumulator[client.client.workspace.id] =
          accumulator[client.client.workspace.id] ?? []).push(client);
        return accumulator;
      }, initial);
    }
  );
  Utils.merge([hyprland.bind("clients")], (clients) => {
    const promises = clients.map((client) =>
      IconFromClass(client.initialClass)
    );
    Promise.all(promises)
      .then((result) => {
        iconClients.setValue(
          result.map((icon, i) => ({ icon: icon, client: clients[i] }))
        );
      })

      .catch((err) => log(err));
  });

  const clientWidget = ({
    client,
    focusedClient,
  }: {
    client: IconClient;
    focusedClient: string;
  }) =>
    Widget.Icon({
      icon: client.icon,
      size: iconSize,
    });

  const workspace = ({
    id,
    clients,
    focusedClient,
  }: {
    id: number;
    focusedClient: Binding<any, any, string>;
    clients: Binding<any, any, IconClient[] | undefined>;
  }) =>
    Widget.Box({
      spacing: spacing,
      children: Utils.merge(
        [clients, focusedClient],
        (clients, focusedClient) => [
          Widget.Label(`${id}`),
          ...(clients?.map((client) =>
            clientWidget({ client: client, focusedClient: focusedClient })
          ) ?? []),
        ]
      ),
    });

  const workspaceContainer = ({
    focusedClient,
    active,
    clients,
    id,
  }: {
    focusedClient: Binding<any, any, string>;
    active: Binding<any, any, boolean>;
    clients: Binding<any, any, IconClient[] | undefined>;
    id: number;
  }) =>
    Widget.Revealer({
      transition: "slide_right",
      transition_duration: animationDuration,
      reveal_child: clients.as((it) => it !== undefined),
      child: transitionContainer({
        binding: Utils.merge([active, submap.bind()], (active, submap) =>
          Widget.Box({
            spacing: spacing,
            css:
              css.padding({ left: 1, right: 1 }) +
              css.borderRadiusAll({ radius: height / 2 }) +
              (active
                ? submap === "C"
                  ? css.backgroundColorRGBA({
                      red: 240,
                      green: 130,
                      blue: 155,
                      alpha: 0.7,
                    })
                  : css.backgroundColorGTK({ color: `@theme_bg_color` })
                : ""),
            child: workspace({
              id: id,
              clients: clients,
              focusedClient: focusedClient,
            }),
          })
        ),
        transition: "crossfade",
        transitionDuration: animationDuration / 2,
      }),
    });

  return Widget.Box({
    spacing: 0, //important!
    css: css.minHeight({ height: height }),
    children: [...Array(10).keys()]
      .map((i) => i + 1)
      .map((id) =>
        workspaceContainer({
          clients: workspaces.as((it) => it[id]),
          id: id,
          focusedClient: hyprland.active.client.bind("address"),
          active: hyprland.active.workspace.bind("id").as((it) => it == id),
        })
      ),
  });
};
