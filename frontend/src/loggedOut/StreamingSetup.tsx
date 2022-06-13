import React from 'react'
import ReactMarkdown from 'react-markdown'

const content = `
[Original guide](https://aws.amazon.com/blogs/gametech/enabling-quest-2-ar-vr-on-ec2-with-nice-dcv/). Ignore, we're doing things different. 

We'll use 3 remoting apps. DCV Viewer just for Windows maintenance stuff (eg, getting everything setup); Parsec for pancake gaming (traditional games); and Virtual Desktop for VR streaming. [Notes: NiceDCV woes](/about/Notes#nicedcv-woes)

## Pancake Games

If you're just playing Steam games, you don't need extra software - Steam has "Steam Remote Play" built in. 
* Client: [Steam Remote Play](https://store.steampowered.com/remoteplay#anywhere) -> Download Steam Link (about half-way down the page, list of links). Run Steam Link, connect to other computer, copy verification code
* Server: Steam -> Settings -> Remote Play -> connect to Steam Link -> enter code

If you want to play other games (GOG, Epic, etc) - use [Parsec](https://parsec.app/). If you get serious about pancake gaming, you may want Parsec anyway; there seems to be more effort on that project than on Steam Remote Play; but do your own research on latency, quality, etc.

## VR

The original tutorial used Oculus Link cable. You don't need it! Virtual Desktop allows wireless remote access. NiceDCV's whole USB filter string setup is such a pain in the ass, that this fact will reduce the tech requirements of that tutorial by half.

* Download / install [Oculus](https://www.oculus.com/rift/setup/). Note, it's easier to log into Facebook if you setup [MFA](https://www.facebook.com/help/148233965247823) first. Otherwise you may get stuck in a verification infinite loop.
  * Virtual Desktop need's Oculus installed (for drivers?) even if you don't use it yourself.
* Steam. Install, then inside Steam install SteamVR. 
* [Virtual Desktop Streamer App](https://www.vrdesktop.net/). Not VD from Steam library, use this website.
  * On Quest, buy/install Virtual Desktop. It's like $10.
  * Run VD Streamer on Windows, connect to it from Quest.

### Virtual Desktop Tweaks

If you experience stutter, fiddle with Virtual Desktop streaming settings Quest-side. I disabled most options (ASW, Slicing, Video Buffer, etc) and things got substantially better. If anyone has more experience here, please drop recommendations.
`

export default function StreamingSetup() {
  return <ReactMarkdown children={content} />
}
