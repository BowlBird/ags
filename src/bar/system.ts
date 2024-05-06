import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const Weather = () => Widget.Label({
    class_name: 'weather',
    setup: self => self
        .poll(3600000, self => 
            execAsync('wttrbar --main-indicator temp_F --fahrenheit')
                .then(weather => self.label = JSON.parse(weather).text + '°')    
        )
});

const Clock = () => Widget.EventBox({
    class_name: 'clock',
    on_hover: (self) => self.child.children[0].reveal_child = true,  
    on_hover_lost: (self) => self.child.children[0].reveal_child = false,  
    child: Widget.Box({
        children: [
            Widget.Revealer({
                reveal_child: false,
                transition: 'slide_right',
                transition_duration: 500,
                child: Widget.Label({
                        class_name: 'clock-text',
                        setup: self => self
                            // this is what you should do
                            .poll(1000, self => execAsync(['date', '+%A, %B %d, %Y'])
                                .then(date => self.label = date)),
                    }),
            }),
            Widget.Label({
                setup: self => self
                    // this is what you should do
                    .poll(1000, self => execAsync(['date', '+%-I:%M:%S %p'])
                        .then(date => self.label = date)),
            }),
            
        ]
    })
    
});

const Volume = () => Widget.EventBox({
    on_hover: (self) => self.child.children[0].reveal_child = true,  
    on_hover_lost: (self) => self.child.children[0].reveal_child = false,  
    child: Widget.Box({
        children: [
            Widget.Revealer({
                reveal_child: false,
                transition: 'slide_right',
                transition_duration: 500,
                child: Widget.Label({
                    class_name: 'volume-text',
                    setup: self => self.hook(Audio, () => {
                        self.label = `${Math.round((Audio.speaker?.volume || 0) * 100)}%`;
                    }, 'speaker-changed'),
                })
            }),
            Widget.Overlay({
                class_name: 'volume',
                child: Widget.CircularProgress({
                    class_name: 'volume-progress',
                    start_at: 0.25,
                    rounded: true,
                    setup: self => self.hook(Audio, () => {
                        self.value = Audio.speaker?.volume || 0;
                    }, 'speaker-changed'),
                }),
                overlays: [
                    Widget.Icon().hook(Audio, self => {
                        if (!Audio.speaker)
                            return;
            
                        const category = {
                            101: 'overamplified',
                            67: 'high',
                            34: 'medium',
                            1: 'low',
                            0: 'muted',
                        };
            
                        const icon = Audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
                            threshold => threshold <= Audio.speaker.volume * 100);
            
                        self.icon = `audio-volume-${category[icon]}-symbolic`;
                    }, 'speaker-changed'),
                ],
            })
        ]
    })
})

const hourlyPercentageChange = () => Battery.energy_rate == 0 ? 0 : Math.round(Battery.energy_rate / Battery.energy_full * 100)


const BatteryLabel = () => Widget.EventBox({
    on_hover: (self) => self.child.children[0].reveal_child = true,  
    on_hover_lost: (self) => self.child.children[0].reveal_child = false,  
    child: Widget.Box({
        children: [
            Widget.Revealer({
                reveal_child: false,
                transition: 'slide_right',
                transition_duration: 500,
                child: Widget.Label({
                    class_name: 'battery-text',
                    label: Battery.bind('percent').transform(p => `${p}%`)
                })
            }),
            Widget.Overlay({
                class_name: Battery.bind('percent').transform(p => {
                   return 'battery'
                }),
                visible: Battery.bind('available'),
                child: Widget.CircularProgress({
                    class_name: 'battery-indicator',
                    start_at: 0.25,
                    rounded: true,
                    value: Battery.bind('percent').transform(p => p / 100)
                }),
                overlays: [
                    Widget.CircularProgress({
                        class_name: Battery.bind('energy_rate').transform(rate => {
                            return Battery.charging ? 'battery-usage-charging' : (rate > 0) ? 'battery-usage-discharging' : 'battery-usage-stable'
                        }),
                        start_at: Battery.bind('energy_rate').transform(rate => {
                            var percent = Battery.percent
                            return ((percent / 100 + .25) - (Battery.charging ? 0 : Math.min(percent / 100, hourlyPercentageChange() / 100))) % 1
                        }),
                        // inverted: Battery.bind('charging').transform(b => !b),
                        rounded: true,
                        value: Battery.bind('energy_rate').transform(rate => {
                            var capacity = Battery.energy_full
                            var percent = Battery.percent
                            if (Battery.charging) {
                                return Math.min(hourlyPercentageChange() / 100, 1 - percent / 100)
                            }
                            else {
                                return Math.min(hourlyPercentageChange() / 100, percent / 100)
                            }
                        })
                    }),
                    Widget.Icon({
                        icon: Battery.bind('percent').transform(p => {
                            return `battery-level-${Math.floor(p / 10) * 10}-symbolic`;
                        }),
                    }),
                ],
            })
        ]
    })
})

export const System = () => Widget.Box({
    spacing: 8,
    class_name: 'system',
    children: [
        Volume(),
        BatteryLabel(),
        Weather(),
        Clock(),
    ]
})