const content = `
## Inspiration

I was playing Celeste's Resort level, trying to get the Golden Berry while I watched [a poor tea kettle cry] and was thinking
about how nice it was that as you clean the resort, the music changes. I had just finished [Sebastion Lagues cave tutorials]
the night before and had yet to start in on his Unity basics and game dev playlists but I wanted to do some experiments on my
own.

## Idea

So, a simple idea of mine was to make some ground for a cube to walk on and as your X value increased, count that as progress
and the further you got, the more instruments would layer in. 

## Setting the Scene

To start with, I made a plane for my player to sit on, which I _think_ comes with physics of its own since it has a mesh collider
built in. That was nice, but it doesn't actually show up on the game window at all. So, I added a cube and stretched it out to the
same width as the plane. 

![Screenshot of my starting scene](/dev-blog/post-images/sound-as-progress-in-unity/starting-scene.png "Simple Box player and his world")

I felt better after getting grounded, and then quickly added a little C# player controller script like I had learned to do in the 9th
episode of those cave tutorials:

	using System.Collections;
	using System.Collections.Generic;
	using UnityEngine;

	public class Player : MonoBehaviour {
	    Rigidbody2D rigid;
	    Vector2 velocity = new Vector2();
	    // Start is called before the first frame update
	    void Start() {
	        rigid = gameObject.AddComponent<Rigidbody2D>();
	    }

	    // Update is called once per frame
	    void Update()  {
	        velocity = new Vector2(Input.GetAxisRaw("Horizontal"), 0).normalized * 5;
	    }

	    private void FixedUpdate()  {
	        rigid.MovePosition(rigid.position + velocity * Time.fixedDeltaTime);
	    }
	}

Well, not exactly how I learned in that tutorial. In the tutorial we had used \`GetComponent\` to get the Rigidbody2D component we
manually added to the cube. However, during the tutorial we had also used the \`gameObject\` a couple of times to make new components.
I tried out both and didn't see much difference between the two. Both of them had this interesting behavior:

![Animated Gif of Player falling through ground](/dev-blog/post-images/sound-as-progress-in-unity/player-problem.gif "Player falls through floor")

So, something was definitely wonky here. Maybe I needed both a collider on the player and the ground? The Ground alone wasn't enough? 
I thought to myself that maybe the problem was that I was trying to mix 2d and 3d, so instead of using a Sprite for the character, I deleted everything
and then added a Cube. Hooked up the script and added a Rigidbody onto it and

![Gif of player moving back and forth](/dev-blog/post-images/sound-as-progress-in-unity/player-working.gif "Player falls through floor")

	using System.Collections;
	using System.Collections.Generic;
	using UnityEngine;

	public class Player : MonoBehaviour {
	    Rigidbody rigid;
	    Vector3 velocity = new Vector3();
	    // Start is called before the first frame update
	    void Start() {
	        rigid = GetComponent<Rigidbody>();
	    }

	    // Update is called once per frame
	    void Update()  {
	        velocity = new Vector3(Input.GetAxisRaw("Horizontal"), 0, 0).normalized * 5;
	    }

	    private void FixedUpdate()  {
	        rigid.MovePosition(rigid.position + velocity * Time.fixedDeltaTime);
	    }
	}

I could now slide back and forth. Great! I figured I'd need to know the x coordinate of my cube later on, so I added a public value
that I'd grab from other scripts.

	public float playerX;

and within the \`FixedUpdate\` and \`Start\` methods I assigned the value itself.

	playerX = rigid.position.x;

## Onto the hard part

The next thing to do was to figure out how sound works in unity. I've recently fiddled around with the WebAudio API interface for a 
small hackathon project and knew about channels and some simple mixing, so I was thinking maybe I'd make 10 channels, attach some 
audio to each, and then make their volumes be a function of the distance traveled. I wasn't sure if this would work or not, so I 
started looking into [the unity sound documentation].

I found the documentation for [AudioSource] and found a useful sounding paragraph:

> You can play a single audio clip using Play, Pause and Stop. You can also adjust its volume while playing using the volume property, or seek using time. Multiple sounds can be played on one AudioSource using PlayOneShot. You can play a clip at a static position in 3D space using PlayClipAtPoint.

The \`PlayClipAtPoint\` thing mentioned sounded like exactly what I needed, but I didn't really want to just add music as you reached a
point, I wanted to build it up and make it be a smooth transition. Just adding drums at point X would be really boring after all. There 
was also this \`AudioSource.maxDistance\` which also sounded possibly useful:

> MaxDistance is the distance a sound stops attenuating at

So it seemed like I could maybe use the max distance to gradually add in new audio as the player progressed? That sounded good, so I attached
a \`AudioListener\` to the player cube so we'd be able to hear sound and tried to just get to the point where I could hear something, and 
immediately discovered that you can

1. Only have One audio listener in a scene or else Unity yells at you.
2. There's already an audio listener on the camera.

So, with that in mind I simply moved the main camera to be a child of the Player component. That way, as the Player cube moves, so does the camera.
Next, I needed music, so I decided that since I'd add music as the user went, I'd attach each audio source to a block or something I could put down
into the scene. As a quick experiment, I dropped in a sphere and added a local sound file to the AudioSource component and hit play. It worked! But,
the default max distance of sound is 500... whatever units, which is far too long since my ground plane probably isn't even a hundred units. So, a
quick tweak to that and I thought I had it, but... nothing changed and the audio stayed just as loud as it was when the cube was next to the sphere.

A little of fiddling with the various sliders on the audio source later, I finally hit on the one that made things work. [Spatial Blend] seemed to help
because I guess "2d" sounds are simply on all the time but "3d" sounds actually change according to the 3d sound settings. That makes logical sense, and 
the settings about volume rolloff and maximum distance were under the "3D sound settings" section of the component controls. So, with the blend set fully
to 3d, I was able to move away from the sphere and my precious [Kaguya Luna's Kick Kick Kick] faded into the distance.

With an understanding of how that worked, I got to thinking again. I'd like to Keep track of these speaker spheres, and as I pass them swap them over to 
full 2d spacial sound so that they still audible when the user has reached that checkpoint. A simple comparison of the x values would do I think. I just 
needed to figure out how to actually get these spheres. You'll have to remember that I've done a grand total of 1 Unity tutorial at this point so beyond
what I'd seen, I have 0 clue about anything else at all! Luckily, I hit on a [nice article about using the various Find methods] and decided that I'd tag
each of my speakers with the inventive "Speaker" tag and then in my Player get a list of them like so:

	speakers = GameObject.FindGameObjectsWithTag("Speaker");

This returns a raw Array, and I was thinking it'd be best to sort the speakers by their x position so we'd be able to short circuit logic more easily later
on, so I copied this into a List so that I call the sort method and then went about creating a few more speakers so that I'd be able to verify it was working
as expected. With a little Comparer:

    class SpeakerComparer : IComparer<GameObject> {
        public int Compare(GameObject a, GameObject b) {
            Transform aTransform = a.GetComponent<Transform>();
            Transform bTransform = b.GetComponent<Transform>();

            return aTransform.position.x.CompareTo(bTransform.position.y);
        }
    }

and the code

    /* Find all speakers and sort them by their x component */
    GameObject[] gameObjects = GameObject.FindGameObjectsWithTag("Speaker");
    for (int i = 0; i < gameObjects.Length; i++) {
        speakers.Add(gameObjects[i]);
    }
    speakers.Sort(new SpeakerComparer());

    foreach(GameObject g in speakers) {
        print(g.name);
    }

I was able to see things working as expected and that my first speaker appeared before my second. Awesome. Now, just one more piece of code before I got to 
making the music. I need to make it so that we swap to 2d sound after the player passes the object. I update the player's movement in the FixedUpdate method,
so that seems like a good place to add this code:

    /* If we are past a speaker object, swap it to 2d sound so we always hear it */
    foreach(GameObject speaker in speakers) {
        Transform speakerTransform = speaker.GetComponent<Transform>();
        AudioSource audioSource = speaker.GetComponent<AudioSource>();
        audioSource.spatialBlend = speakerTransform.position.x >= playerX ? 1 : 0;
    }

At this point I had something working, I made three audio files and after adding them to the speakers I was able to play the game and it worked. Kinda.

## Sync issues.

An interesting, and kind of weird thing was now happening that's hard to show with screenshots, but basically the three speakers were out of sync. Maybe I 
should have anticipated that having three tracks playing might not all start at the same time. But since they all had "play on awake" checked off I thought
that even though they weren't audible, that they'd stay synced up together. I'm no audio engineer, so I went and did the normal thing anyone does. Web search.
I found [this post about audio syncing] and added the following code to my start method:

    /* Sync audio samples */
    AudioSource firstSpeaker = speakers[0].GetComponent<AudioSource>();
    foreach(GameObject speaker in speakers) {
        AudioSource audioSource = speaker.GetComponent<AudioSource>();
        audioSource.timeSamples = firstSpeaker.timeSamples;
    }

It worked, or at least, on the first playthrough of the songs it did, but it seemed like there's some form of delay before the loop actually happens for audio. 
I searched around for a while, found old forums of people having this issue and then was fiddling with the various LoadTypes in the asset inspector when I noticed
the obvious... the delay was from my exported sound files! So, some trimming later and I had something that was working better!

## Finished result

It's not that impressive but for a couple hours of work in a framework I barely know I feel pretty happy about it:

<video controls autoplay=false>
    <source src="/dev-blog/post-images/sound-as-progress-in-unity/Finished-Experiment.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

You can see the code for yourself [here on Github]

## Future Improvements

I really didn't enjoy tweaking the speakers one at a time, I think what I should have done is created an empty game object, assigned public audio source properties, 
and then managed more of the audio handling in code. It'd probably make for simpler logic, less lookups of components from the Player's update function, and might 
have helped me resolve more things. I'm also curious if I could just generate the audio with a midi player instead. I like using flat.io, but losing a half hour because
the export function added an extra 3 seconds of silence to the end of two of my three files was a nonobvious issue to me.



[a poor tea kettle cry]:https://www.youtube.com/watch?v=9nmt7DzGCUU
[the unity sound documentation]:https://docs.unity3d.com/ScriptReference/30_search.html?q=sound
[AudioSource]:https://docs.unity3d.com/ScriptReference/AudioSource.html
[Spatial Blend]:https://docs.unity3d.com/ScriptReference/AudioSource-spatialBlend.html
[Kaguya Luna's Kick Kick Kick]:https://www.youtube.com/watch?v=vgASRm9Du7U
[nice article about using the various Find methods]:https://www.codinblack.com/how-to-find-game-objects-in-unity3d/
[this post about audio syncing]:https://answers.unity.com/questions/790707/how-to-make-two-audio-tracks-play-in-sync.html
[here on Github]:https://github.com/EdgeCaseBerg/unity-sound-experiment
`;
module.exports = {
  content
};