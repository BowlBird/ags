#!/bin/python3
from colorthief import ColorThief
import sys
import json
# grab from path provided as an argument
color_thief = ColorThief(sys.argv[1])
# return result of generating palette as parsable json
data = list(map(lambda color: {"red": color[0], "green": color[1], "blue": color[2]},color_thief.get_palette(color_count=2, quality=10)))

# we expect 3 results, lets name them.
print(json.dumps({
    "background": data[0],
    "primary": data[1],
    "secondary": data[2]
}))
