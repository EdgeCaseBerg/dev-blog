const content = `
## What's up?

After working on [the tutorial for falling blocks] I ate some pizza, surfed the net, and then jumped into 
the last part of the [tutorial series]. Which culminated in creating a simple stealth game. The fun part
was that this time, at key points in the tutorial, Sebastian would put up an instruction to try to do the
next part yourself and then go on to the solution. I did most of these by myself, including nearly the 
entire 3rd video's challenged content, but generally when it came to the trigonometry stuff I left it to
the tutorial to guide me through.

## The usual additions

After getting the basic game done, I added in coins in order to try to co-erce the player to go and be a
little more daring and to risk getting caught by guards rather than going straight for the goal zone. The
fun part of this was that I made them spin this time! The code was simple:

    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class Coin : MonoBehaviour
    {
        public float degreesPerSpin = 180;

        // Update is called once per frame
        void Update()
        {
            transform.Rotate(0, 0, degreesPerSpin * Time.deltaTime);
        }
    }

I found that 180 worked well as a per-update spin amount, small numbers made it barely noticeable, and outrageously
large amounts were exactly what you would expect. My level design was crap, as I just haphazardly placed obstacles
down, and I probably made the map too big as well. Either way, the final product looked like this:

<video controls autoplay=false>
    <source src="/dev-blog/post-images/stealth-game/stealthgame.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

I had fun, and that caps off the tutorial for his Introduction to Game Development series. So I can check that off
my todo list and think about trying his platformer series or something else. I'll keep you all udpated on any more
coding adventures I take in unity. If you're interested in seeing the code, you can see it [here on github].

[the tutorial for falling blocks]:#/dev-blog/falling-blocks
[tutorial series]:https://www.youtube.com/watch?v=jUdx_Nj4Xk0&list=PLFt_AvWsXl0fnA91TcmkRyhhixX9CO3Lw&index=24
[here on github]:https://github.com/EdgeCaseBerg/unity-stealth-game
`;
module.exports = {
  content
};