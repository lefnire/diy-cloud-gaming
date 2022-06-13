import React from 'react'
import ReactMarkdown from "react-markdown";

const content = `
Many people don't have the time, money, or desire to build a PC. There are lots of new VR users (Quest 2) who'd love to play the AAA titles like Half-Life Alyx, Asgard's Wrath, Lone Echo, etc. Cloud gaming is starting to pick up, with various options like GeForce Now, Stadia, Shadow PC, and Luna. The only of these options that supports VR currently is Shadow; but their GPU is limited to GTX 1080 (not ideal for VR). If you only want pancake (traditional) gaming, I recommend Geforce Now. If you want VR support, I recommend following this tutorial.

## Pros/cons vs home PC
Cloud Pros
- Cost. Save time & money. Gaming desktops/laptops are expensive ($1.5-3k). Gaming desktops take time to build. Both take time to research. Gaming on AWS, you pay per-hour-used. If you game little, that's cheap - if you game lots, there's solutions to keep it cheap (Spot Instances).
- Ignore hardware. Keep up with hardware without upgrading. New AWS GPU instance? Hop on over! And how about today's GPU shortages, amirite?
- Mobile. Game on the road from any laptop. Or via Virtual Desktop or Steam Remote Play, no laptop needed - just Quest, phone, etc!

Cloud Cons
- Online-only. No offline support, always need internet.
- Latency. This is a big con. The latency introduced through streaming will cause lower FPS than you'd get from a home PC. However, I've played many hours of VR through this setup and I find the latency acceptable. When I find time, I'll do some profiling and drop the numbers here.

## Non-DIY

If this tutorial looks like a lot, you have alternatives. The trade-off is bang-for-buck. This tutorial will get you the strongest, cheapest setup; at the cost of a headache. The below solutions will get you off-the-shelf gaming, but more expensive and lower powered (save GFN's 3080 option). I'm not a wheel-reinventor, so I'd have just used one of these myself except for two points:
  - Game re-use. I want to re-use my existing Steam / Oculus / GoG purchased games. Stadia requires re-purchases. GFN only supports certain linked titles.
  - VR. Except PlutoSphere and Shadow PC, none of these options support VR. 

### [PlutoSphere](https://www.plutosphere.com/) (VR for newbs)

The simplest solution for newbies. It's a VR-dedicated streaming solution; they manage the servers and game installations, you just install the Quest app & play. My suggestion: try this first, try it now. Get some good gaming in and worry about the future later. While it's in beta, I don't think you need to buy games - so even the worst-case scenario is no loss to you!

Pros
  - Easy as pie, great for non-techies: like Stadia for VR. 
  - Since it's VR-specific, all their efforts are VR streaming. This is important; unlike Shadow/AWS solutions which will use default streaming tech, Pluto will engineer around VR-streaming bitrate / FPS / compression / encoding for optimal latency & gameplay.

Cons. Since it's beta, there's some concerns
  - I understand you need to reserve time slots
  - We don't know know what their pricing model will be. Will you need to re-purchase Steam/Oculus games?
  - Oculus has an anti-streaming policy. The other services could get by this by leaving it to the user (hosted PC, do what you want); I worry Pluto will be a Meta target.

### [Shadow PC](https://shadow.tech/blog/news/shadow-vr-exploration) VR (skip)

Hosted PC in the cloud. You use your own Oculus/Steam account for games.

Pros
  - Re-use your existing game purchases

Cons
  - GTX 1080, hard rule. That's not great for VR, so I'm ruling this option out personally. I'm sure they'll upgrade, but why wait when there are other solutions.

### [GeForce NOW](https://www.nvidia.com/en-us/geforce-now/) (best non-VR)

Hosted PC in the cloud, like Shadow - but more powerful (and more expensive). RTX 3080 @ $99/6mo. GFN is what I'm keeping my eye on the most. Stadia & Luna don't seem to care about VR, but Nvidia does. They're working on CloudXR (streaming VR) technology, and have tutorials on hosting that yourself (developer account required) in the mean time. If you want my guess, I'd say in 6-8mo this whole post gets scrapped as GFN suddenly announces surprise CloudVR.

Pros
- Re-use your existing games. 
- Monster PC. 
- Managed/patched by Nvidia, leave the details to them - you deal with the games & VR-streaming setup. 
- Likely bright future for VR streaming.

Cons
- Expensive, $99/6mo. But - 99/6/30/24 = $0.023/h. So if you play a crap ton all the time, it's cheaper than AWS. If you drop in from time to time, AWS will be cheaper.

### [Stadia](https://stadia.google.com/), [Luna](https://www.amazon.com/luna/landing-page)

I don't have experience with either. TODO fill this out.

## DIY: AWS [NiceDCV](https://aws.amazon.com/blogs/gametech/enabling-quest-2-ar-vr-on-ec2-with-nice-dcv/)

TODO: update this, since using Parsec instead of NiceDCV

Finally, my fave solution! Bit of latency yes, but no worse than when my laptop's RTX 2070 gets hot and throttles. So this is the solution I'm using personally, and I've played many hours of Alyx & Asgard's.AWS is Amazon's cloud hosting for companies; as general purpose as it gets, hosts the majority of the internet - so they've got this dialed. You can setup cloud Windows Server 2019 with Nvidia A10G GPUs. Depending on your instance, the range is roughly $.70-$1.20/h - so calculate based on how many hours/day you play before choosing this. But it's nice there's no cost lock-in, it's pay-per-use. Requires a lot of tech know-how (IAM, VPC, Security Groups, etc). In the end it's just a cloud PC, like Shadow or GFN. You'll then setup Virtual Desktop streaming app, enable remote PC, connect from Quest. Bing bang boom.Tech notes on the tutorial link

Pros
- On-demand pricing. Pay per hour, no lock-in
- Beef computers
- Virtual Desktop handles VR streaming. Encoding, compression, etc. It works!

Cons
- Major technical know-how. This is DevOps stuff
- A10G (unlike RTX 20s/30s) causes some apps to scratch their head.

`

export default function WhyDIY() {
  return <ReactMarkdown children={content} />
}