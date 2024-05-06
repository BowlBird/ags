import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const SysTray = () => Widget.Box({
    children: [Widget.Box ({
        class_name: 'systray',
        children: SystemTray.bind('items').transform(items => {
            return items.filter(item => item.id != 'nm-applet' && item.id != 'blueman').sort((a,b) => a.id.localeCompare(b.id)).map(item => Widget.Button({
                child: Widget.Icon({ icon: item.icon,  }),
                on_primary_click: (_, event) => item.openMenu(event),
                on_secondary_click: (_, event) => item.openMenu(event),
                tooltip_markup: item.tooltip_markup
        }));
        }),
        }), 
        Widget.Box ({
            class_name: 'systray',
            children: SystemTray.bind('items').transform(items => {
                return items.filter(item => !(item.id != 'nm-applet' && item.id != 'blueman')).sort((a,b) => a.id.localeCompare(b.id)).map(item => Widget.Button({
                    child: Widget.Icon({ icon: item.icon,  }),
                    on_primary_click: (_, event) => item.openMenu(event),
                    on_secondary_click: (_, event) => item.openMenu(event),
                    tooltip_markup: item.tooltip_markup
            }));
        }),
    })]
});