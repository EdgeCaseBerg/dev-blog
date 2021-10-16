const content = `
## Following Video 2

Just like [last time], I'm following the [tutorial video] that goes through the marching square algorithm for unity and C#. 
I'm then taking that information and code and converting it into typescript and into the Cocos creator framework for fun.
I'm not going into detail for each part like the video does, but instead just blogging about anything that pops up as interesting
as I go through this process. So, be forewarned that this is just a collection of gotchas and aha moments from an idiot learning a
few new tricks.

## Typescript class constructors

About 5 minutes into the video, after the excellent breakdown of control nodes and how we'll be representing mesh triangle configurations
with numbers 0 - 14, Sebastion begins instructing us to create a inner class called Node. Now, Cocos creator already _has_ a class called
Node. So, my code won't be having the same, for now I'll just call it _MNode_ because it's a node inside of the mesh generator class.
Secondly, I actually don't know how to declare a constructor in typescript. So, [I had to look it up]. It's bizarre, but this is the third
way of constructor-ing that I think I've seen before.

In C++ I know of just using the class name for the constructor method. In scala you can use _this()_ and if you're working with companion objects
and case classes you can use the apply method. I've probably seen other methods before as well over the course of using the various languages I've
worked in over the years, but I think this is the first time I've ever actually seen the word constructor used for the constructor. How bizarre:

	class MNode {
	    public position: Vec3;
	    public vertexIndex = -1;

	    constructor(_pos: Vec3) {
	        this.position = _pos;
	    }    
	}

The other unfortunate thing is that, while C# allows Sebastian to make his Node class an inner class, I can't do the same in typescript [without some wonkery], so I elected not to do that and instead cluttered up my global namespace with these classes. Such is life.

## Lengthy vector math in typescript land

Following Sebastian's conventions, I've named the incoming arguments with an underscore and assigned them as expected. The next class we make takes
a dramatic leap from C# land into Typescript though. Sebastion's code is easy to read and understand because of the way C# methods can be defined 
and made to look really really clean. AKA, the vector math is nice looking in this C# code:

	public ControlNode(Vector3 _pos, bool _active, float squareSize) : base(_pos) {
		active = _active;
		above = new Node(position + Vector3.forward * squareSize/2f);
		right = new Node(position + Vector3.right * squareSize/2f);
	}

However, Cocos creator's vectors are less... nice:

	class ControlNode extends MNode {
	    public active: boolean;
	    public above: MNode;
	    public right: MNode;

	    constructor(_pos: Vec3, _active: boolean, _size: number) {
	        super(_pos);
	        this.active = _active;
	        let outPosition1: Vec3;
	        let abovePosition: Vec3;
	        Vec3.multiplyScalar(outPosition1, Vec3.FORWARD, _size/2.0);
	        Vec3.add(abovePosition, this.position, outPosition1);
	        this.above = new MNode(abovePosition);

	        let outPosition2: Vec3;
	        let rightPosition: Vec3;
	        Vec3.multiplyScalar(outPosition2, Vec3.RIGHT, _size/2.0);
	        Vec3.add(rightPosition, this.position, outPosition2)
	        this.right = new MNode(rightPosition);
	    }
	}

The main reason for this lengthy code is because the Coco's vector library helpers take in a vector that it will then populate with the results of the
operation. As oppose to returning one. I'm sure there's a reason for this, I'd assume performance, but it is a bit of a pain. Especially since I'm not
even sure if I should be initializing the vector I pass in or not!

## The joy of not having Gizmos...

If you recall, [last time] I noted that Cocos doesn't have the Gizmos debugging tool that Unity does, but I worked around it by just spawning prefab cubes
in the places we needed to show the boxes. That worked well enough if you consider that instead of coloring the boxes white and black based on their active
state I just spawned a block or didn't. However, in the code that Sebastian starts whipping up around 20 minutes into the tutorial, he starts setting the 
color of his debugging boxes.

I tried. I really did, looking at the mesh renderer and the graphics components in cocos, heck I even thought I had things going in the right direction when I was looking at [the fill color page]... before I realized that was for the 2d library components and not the 3d one. But eventually, I landed on
[the 3d primative page] and realized that I couldn't get away with my tricks anymore and I actually needed to make my own cube if I wanted to color things
in as expected. Which seems kinda silly when you consider that the whole point of all these control nodes and things are to make a mesh. But I wanted to 
be able to debug in a similar way so I could follow along the tutorial nicely, so... I kept reading, and kept fiddling with intellisense, and [reading about meshes] and even briefly contemplating ditching cocos and just using unreal or something. But, after looking through some blog posts and being reminded about the wonderful world of preprocessor directives I decided to go back to cocos and try to keep things simple for now and that's when I found 
[the aviator project code]. Which seemed promising. But, no dice considering that's using the 2.x code and seems to contain the code that the other page was using too.

After an hour or so of looking around, I somehow managed to land on the [Javascript API reference page] and, despite fiddling around in my editor, the intellisense was telling me none of this stuff actually existed in the code I was using. Past midnight, and feeling slightly defeated, I put down the 
project for a little while and wondered what I could do to get this working again or if I'd need to swap away from this pipedream of trying to use a "simple" game engine first before jumping into one of the more well known ones. 

I slept on it, talked to a coworker the next day about my little side project, and then decided that if Unity was easier to use than cocos, better documented, and other people
[had noted that it really didn't work well for them either], then well, maybe I was barking up the wrong tree. With that, I decided to uninstall Cocos, finish this blog post up, 
and decide to start fresh from part 1 again next time. I'll see you then.

[last time]:following-a-unity-tutorial-in-cocos-creator
[tutorial video]:https://www.youtube.com/watch?v=yOgIncKp0BE
[I had to look it up]:https://www.typescriptlang.org/docs/handbook/2/classes.html
[without some wonkery]:https://stackoverflow.com/questions/32494174/can-you-create-nested-classes-in-typescript
[the 3d primative page]:https://docs.cocos.com/creator/manual/en/3d/primitive.html
[the fill color page]:https://docs.cocos.com/creator/manual/en/render/graphics/fillColor.html
[reading about meshes]:https://docs.cocos.com/creator/manual/en/3d/mesh.html
[the aviator project code]:https://github.com/cocos-creator/demo-the-aviator/blob/master/assets/src/primitive/primitive.js
[Javascript API reference page]:https://docs.cocos2d-x.org/api-ref/js/v3x/
[had noted that it really didn't work well for them either]:https://www.quora.com/Cocos-Creator-is-out-Does-it-mean-that-Cocos2d-x-is-also-the-past-Is-Cocos2d-x-still-worth-learning
`;
module.exports = {
	content
};