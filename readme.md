# DIY Cloud Gaming - Including VR

This tutorial has you setup a cloud game-streaming service in your AWS account. It also supports wireless VR streaming on Oculus Quest via Virtual Desktop. 

<details>
<summary>Pros/cons vs home PC</summary>

Cloud Pros:
* **Cost**. Save time & money. Gaming desktops/laptops are expensive ($1.5-3k). Gaming desktops take time to build. Both take time to research. Gaming on AWS, you pay per-hour-used. If you game little, that's cheap - if you game lots, there's solutions to keep it cheap (Spot Instances).
* **Ignore hardware**. Keep up with hardware without upgrading. New AWS GPU instance? Hop on over! And how about today's GPU shortages, amirite?
* **Mobile**. Game on the road from any laptop. Or via Virtual Desktop or Steam Remote Play, no laptop needed - just Quest, phone, etc!

Cloud Cons:
* **Online-only.** No offline support, always need internet.
* **Latency**. Redditors often say it's great for single-player games, less so for high reaction-time multiplayers. I've sunk *hours* into gaming on this setup, no complaints.

</details>

<details>
<summary>Oculus Quest</summary>

So you like BeatSaber? Sweet summer child. If you haven't played *Half-Life Alyx*, you may have had fun - but you haven't dropped your jaw.

The coolest VR games aren't supported natively on Quest, directly through the Quest store and running on the Quest's SoC. That's because these AAA titles (like *Half-Life Alyx*, *Asgard's Wrath*, *Boneworks*, and *Lone Echo*) require a powerful CPU and GPU to process and render. You can then stream gameplay to Quest either tethered via Link Cable; or wirelessly via Air Link. This works wonderfully, and many home PC-builders have been playing AAA games on their Quest this way for years.

Air Link isn't the only option; Virtual Desktop is awesome (and required, in this tutorial). Via this tutorial, you can setup a PC in the cloud (AWS) to heavy-lift *Alyx*, then wirelessly stream to your Quest.

</details>

<details>
<summary>Non-DIY options</summary>

If this tutorial looks like a lot, you have alternatives. The trade-off is bang-for-buck. This tutorial will get you the strongest, cheapest setup; at the cost of a headache. The below solutions will get you off-the-shelf gaming, but more expensive and lower powered (save GFN's 3080 option). I'm not a wheel-reinventor, so I'd have just used one of these myself except for two points:

* **Game re-use.** I want to re-use my existing Steam / Oculus / GoG purchased games. Stadia requires re-purchases. GFN only supports certain linked titles. 
* **VR**. Except PlutoSphere (more below), none of these options support VR. 

## PlutoSphere (VR)
The simplest solution for VR newbies. It's a VR-dedicated streaming solution; they manage the servers and game installations, you just install the Quest app & play. My suggestion: try this first, try it now. Get some good gaming in and worry about the future later. While it's in beta, I don't think you need to buy games - so even the worst-case scenario is no loss to you!"
  
Pros
- Easy as pie, great for non-techies: like Stadia for VR. 
- Since it's VR-specific, all their efforts are VR streaming.
  "This is important; unlike Shadow/AWS solutions which will use default streaming tech, Pluto will engineer around VR-streaming bitrate / FPS / compression / encoding for optimal latency & gameplay."

Cons
- Since it's beta, there's some concerns:
- I understand you need to reserve time slots
- We don't know know what their pricing model will be. Will you need to re-purchase Steam/Oculus games?
- Oculus has an anti-streaming policy. The other services could get by this by leaving it to the user (hosted PC, do what you want); I worry Pluto will be a Meta target.


## Shadow PC (VR, Pancake)
Hosted PC in the cloud. You use your own Oculus/Steam account for games.
- Pros
  - Re-use your existing game purchases
- Cons
  - GTX 1080, hard rule
    "That's not great for VR, so I'm ruling this option out personally. I'm sure they'll upgrade, but why wait when there are other solutions."

## GeForce NOW (Pancake)
"Hosted PC in the cloud, like Shadow - but more powerful (and more expensive). RTX 3080 @ $99/6mo. Set this up, then setup Virtual Desktop (per AWS Nice instructions below) to stream wirelessly to your Quest. GFN is what I'm keeping my eye on the most. Stadia & Luna don't seem to care about VR, but Nvidia does. They're working on CloudXR (streaming VR) technology, and have tutorials on hosting that yourself (developer account required) in the mean time. If you want my guess, I'd say in 6-8mo this whole post gets scrapped as GFN suddenly announces surprise CloudVR."
- Pros: Re-use your existing games. Monster PC. Managed/patched by Nvidia, leave the details to them - you deal with the games & VR-streaming setup. Likely bright future for VR streaming.
- Cons: Expensive, $99/6mo. But - 99/6/30/24 = $0.023/h. So if you play a crap ton all the time, it's cheaper than AWS. If you drop in from time to time, AWS will be cheaper.

Note: while I'm super interested in GFN for VR, I don't know if it will work. The AWS solution for example requires certain ports be open for Virtual Desktop, and I'm not sure how much control you have over GFN. So take this recommend with a grain of salt (or hopefully someone can comment) and keep an eye on the company going forward.

## Stadia, Luna (Pancake)
- Don't hold your breath

"I have 0 hope Stadia will add VR support. I have some hope for Luna, given below tutorial, but not much."


</details>

---

## Setup

Setup

- Original tutorial
  "Ignore this, these instructions are updated. Eg using g5 instances and ignoring Oculus Link (use Virtual Desktop's wireless streaming).
  "
- Basics
  - Setup an AWS account, credit card, etc
  - Ensure your AWS user has
    - Access/permission to create EC2 instances (Specifically G5)
    - Access/permissions to AWS Marketplace
  - Have accounts for
    - Facebook + Oculus
    - Virtual Desktop (buy on Oculus Quest, $10 when I checked)
    - Steam 
- Create a VPC
  "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html"
  - Public subnet in the region closest to you
    "It will default to us-east-1 (New York); find the one closest to you
    "
- Spin up Graphics intensive EC2 instance #left-at
  "https://aws.amazon.com/blogs/gametech/enabling-quest-2-ar-vr-on-ec2-with-nice-dcv/"
- Use g5.2xlarge instance
  "They recommend g4dn (2xlarge minimum); a month later, g5 instances were released, 30% faster. That's Nvidia T4 vs A10G GPUs respectively. The G5 instances are A10G GPUs. They're intended for machine learning workloads, not gaming really. But they're RTX chips nonetheless, and absolute MONSTERS. Steam/Oculus will throw "minimum hardware" issues - that's only because they don't recognize the chip; it's unusual for gaming. Ignore that, you can play anything on Ultra."
- Ignore everything about Oculus Link cable
  "you don't need it! Virtual Desktop allows wireless remote access. NiceDCV's whole USB filter string setup is such a pain in the ass, that this fact will reduce the tech requirements of that tutorial by half."
- You need Virtual Desktop streaming app
  "You can't do this through Oculus or Steam alone - they kinda breezed VD, but it's a requirement."
- Make sure you setup the VPC close to you
  "It will use us-east-1 (New York?) by default."
- Regarding Nice DCV
  "that's nothing more than a remote desktop protocol for high-performance computing (eg gaming). It's great for pancake gaming actually, so you can use this solution for normal games via the Nice desktop client (even on Mac, web, etc). But Nice isn't the important part; what's important is that the Nice team created AMIs with Nvidia gaming driver pre-installed, per that tutorial. The reason they pushed Nice here is, unlike Remote Desktop, it supports USB pass-through for Quest Link - but you won't be using Quest Link, you'll use VD's wireless remote PC. So again, skip the USB stuff in that tutorial."
- If you experience stutter
  "Fiddle with Virtual Desktop streaming settings Quest-side. I disabled most options (ASW, Slicing, Video Buffer, etc) and things got substantially better. If anyone has more experience here, please drop recommendations."
- When you're done gaming, power down Windows (start > shut down).
  "Don't terminate the instance, you'll lose it! You won't be charged for shut-down instances in AWS, so just boot it up later when you wanna play."
- I got this solution working and I love it; later I'm going to try another AWS solution, GeForce CloudXR server. Even more techie, it requires developer accounts for Nvidia, Oculus, and some manual PC->Quest USB file installations. But it might be even faster for streaming.
