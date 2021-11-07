const content = `
## What's up?

Today I finally got around to doing [the tutorials] from Sebastian Lague on making a falling block game.
I've been meaning to do this for a few weeks now, but I've been busy being stressed by a million other things, so I haven't.
On this fine lazy sunday morning though, I went for a walk, saw some fallen trees, and found my motivation after some creepy
dude in a blue overcoat kept popping up behind me out of nowhere while I walked.

## Lerp. A new concept for us in this tutorial.

Even though it's tutorial code, and plenty of people have done it before, I figured I'd toss the code up [on github] since
it's nice to have a place to reference it when I blog about anything interesting. The new thing that was introduced to me
today was the way he implemented the difficulty of the game. This was done using a static file that returned a simple percentage
that he then used throughout the game to scale various parameters by using the "Lerp" value.

I implemented the difficulty class as he did, watched his explanation of the Linear interpolation, and then noted that I should come back to it
in the future because it didn't quite stick. In my experience, the best way to really wrap your head around something you don't get
right away is to teach it to someone else so that you're forced to explain it in your own words. So, re-watching his explanation my focus 
shifted onto the equation.

    value = a + (b - a)p

Perhaps it was because I was trying to keep up with the coding at the time that it didn't quite work, but really, it's simple to understand
how this gives you a value between a and b when you distribute the percentage p out in the equation. Since:

    value = a + bp - ap

will reduce to \`a\` if \`p = 0\` and to b if \`p = 1\`. For whatever reason it didn't register when I first saw it, but now it does. 
Fun me fact, I was absolutely awful at algebra in highschool yet still managed to get a math minor in college. Maybe this is just a result
of my brain slowly getting smoother as I age ;)

## Proper Communication between game objects

Even though it wasn't new to the series (if you look at the full playlist I linked above), the GameOver screen and its trigger was a great
refresher of the Event delegate pattern we'd been introduced to in previous videos. Specifically, that when a player collides with a block:

    public event System.Action OnPlayerDeath;
    ...
    private void OnTriggerEnter2D(Collider2D triggerCollider) {
        if (triggerCollider.tag == "Falling Block") {
            if (OnPlayerDeath != null) {
                OnPlayerDeath();
            }
            Destroy(gameObject);
        }
    }
    
We emit the OnPlayerDeath event. Which, over in the GameOver script we subscribe to

    void Start()
    {
        FindObjectOfType<PlayerController>().OnPlayerDeath += OnGameOver;
    }

and display the game over canvas when it happens. This is all pretty basic event stuff, but it is nice to see this in action.

## Building an exe

This is also the first time that Sebastion has shown us viewers the build settings and actually creating an exe for us to use
to play the game outside of unities preview. The differing versions of unity and the fact that I'm on a Windows machine and
not a Mac made some settings differ, but just ignoring the seemingly Mac-only settings around shutting off the resolution
selection dialog worked just fine.

It certainly made capturing game footage of the completed game easier since I could use OBS's gamewindow capture instead of 
cropping down a window capture of unity or my full display to just the game screen like I had in the past.

## Improvements on the script

A couple thoughts occured to me while I was finishing up, specifically:

 - It seems inefficent to create and destroy blocks over and over, would it be better to maintain a max number of blocks and recycle?
 - Modifying the speed of the falling blocks and things from the prefab to adjust difficultity, rather than from the Difficulty seems odd.
 - Add coins to collect that give you a higher score

The first bullet point is something I think I could probably handle, it'd be a matter of making a block wrap to the top of the screen like
our player does, and then re-sizing and re-angling it like the spawner does. It strikes me as odd that the spawner handles the randomization
of the block, I think I'd like to move that into a function so we could improve this.

The second bullet point I'm not sure on. It makes sense that the speed of an object is contained within it, but since the adjustments to it 
were made in the name of difficulty, and we had to jump around between scripts to do so, that perhaps it would have been better, from a
configuration stand point, if the difficulty class also defined these and then the prefabs referenced the static methods. In that case, I
probably wouldn't call it "Difficulty" but maybe just something like GlobalConfiguration or something like that. If we did something like that
I imagine a configuration file could be included in the game and we could load the contents to determine the initial values, allowing for 
players to modify things as they wanted or something like that.

While web programming generally shys away from globals, it seems that it's pretty common to have global configuration in video game code, 
so this kinda thing seems obvious to me, but I could be wrong. 

##  The original game in action

A video's worth a thousand still frames, so here's the game:

<video controls autoplay=false>
    <source src="/dev-blog/post-images/falling-blocks/fallingblocks.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

## Adding coins

This was actually really really simple to do now that I've been walked through the process of making these falling block prefabs and 
subscribing events to react to. First, we create a new prefab for a coin. This is easily done by using GameObject -> 3D -> Sphere to
add a sphere to the screen, then deleting the pre-existing sphere collider and replacing it with a 2d circle collider, we set the collider
to "Is Trigger true" so that it emits an event when it touches the player's collider, and then we tag the coin with "Coin" as a new tag.

After dragging the sphere to the prefab asset folder, we now have a prefab and can attach our script to it. The script is a copy of the
falling blocks script (so that it falls down the screen with some given speed) and that's about it. We don't need to handle the collision
here, that will be the player's responsibility.

Next, we update the spawner so that it creates a coin at a random angle (but not a random size) at the same time as it generates a new block.
This way, the player always has a coin to chase and a cube to dodge. After that copy-paste job, we update the player's collider so that it now
looks to see when it runs into a coin:

    public event System.Action OnCoinCollect;
    ...
    if (triggerCollider.tag == "Coin") {
        if (OnCoinCollect != null) {
            OnCoinCollect();
        }
        Destroy(triggerCollider.gameObject);
    }

As you can tell, I'm using an event to do this, that way I can keep the seperation of concerns between the player and their score. A player's
score is an attribute of the overall game, not of the player themselves! So, with that in mind, I create a new game object called Score Display
under the canvas object we made the GameOver screen for, and then I attached a script that listens for the coin collection event:

    using System;
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    using UnityEngine.UI;

    public class ScoreDisplay : MonoBehaviour
    {
        public Text scoreDisplayText;
        private int coinScore;

        // Start is called before the first frame update
        void Start()
        {
            FindObjectOfType<PlayerController>().OnCoinCollect += OnCoinCollected;
            coinScore = 0;
        }

        private void OnCoinCollected() {
            coinScore += 1;
        }

        // Update is called once per frame
        void Update()
        {
            scoreDisplayText.text = "Coins: " + coinScore;
        }
    }

Super easy, and just like that, after assigning the game objects and text object to the appropriate places in Unity, I
had a working coin collection while dodging blocks minigame! You can see the full changes [in this commit here], or just
watch this little video:

<video controls autoplay=false>
    <source src="/dev-blog/post-images/falling-blocks/withcoins.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

[the tutorials]:https://www.youtube.com/watch?v=6nfaPDPA-Y8&list=PLFt_AvWsXl0fnA91TcmkRyhhixX9CO3Lw&index=14
[on github]:https://github.com/EdgeCaseBerg/unity-falling-block-game
[in this commit here]:https://github.com/EdgeCaseBerg/unity-falling-block-game/commit/e238be535de47c71306c52bf839bf80ba6ea75e2

`;
module.exports = {
  content
};