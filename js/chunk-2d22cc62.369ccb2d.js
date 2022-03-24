(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22cc62"],{f552:function(e,n){var t="\n\n## Following Video 1\n\nNote that I'm not really doing anything smart here, just blogging my thoughts as I copy and transcribe the C# from Sebastion's video series into\ntypescript and try to translate from Unity to Cocos for the sake of learning a little bit more about Cocos. For your own good, it might help if you \nwatch Sebastion's video first. [You can do so here].\n\nThe finished code for this little project can be found [here on Github]. The blog post is not a tutorial, but just noting the few places I got tripped up\nand where I discovered something I didn't know.\n\n### Setup\n\nFirst things first, I made a new project, selected 3D since I knew that one day if I manage to follow all the steps in the youtube tutorial, \nI'd be doing something 3d-ish, and I didn't want to have to figure out how to change from 2d to 3d later... assuming there is one. Next, I ran into the obvious issue\nof following a C# unity tutorial and trying to convert it into a CocosCreator typescript program. Considering that I don't program regularly\nin either of these languages, I figured this would be a good learning experience, and it didn't take too long before I was running into my first\nissue. \n\nAbout 2 minutes into the [first video] I saw Sebastian's use of the range type. I looked in cocos creator's documentation, and tried to google a\nlittle bit but didn't find anything similar in cocos. So, I settled in on a plain number, but out of curiousity, I tried playing around with the\nproperty annotation, and to my surprise this worked:\n\n    @property({type: CCInteger, min: 0, max: 100})\n    public randomFillPercent: number = 40;\n\n![Screenshot of range working in cocos](/dev-blog/post-images/following-a-unity-tutorial-in-cocos-creator/property-min-max.png \"Min and max declared\")\n\n\nIt took about 10 minutes of searching the net to actually [find the documentation about this] by the way. I thought that cocos, since it appeared\nin windows visual studio as a possible game engine on the project start page I saw before, was more mature, but eh... I'm starting to rethink that.\nBut not rethinking it enough to back out of my hope to follow Sebastian's tutorial in this engine. So, with a decent reference to the API documents\nfor coco, and google as my ally for learning more typescript, I continued on. After a little more reading I found out that there was an actual range\nproperty and that I could make the component in the Cocos UI become an actual slider like this\n\n    @property({type: CCInteger, range: [0, 100, 1], slide: true})\n    public randomFillPercent: number = 40;\n\nPretty neat. Moving on, I watched the video as Sebastian started making his representation of the world.\n\n### Random Numbers\n\nNothing special about the array used to keep track of the color of the map pieces besides its syntax being _very_ Java-y:\n\n    map: Array<Array<number>> = [[0,0]];\n\nhowever when I wanted to fill the map with a random 1 or 0 based on a seed value I ran into a problem. Javascript, and therefore Typescript, doesn't let\nyou seed a random number generator. There's no built ins for this like you'd find in JVM based languages.  Luckily, [StackoverFlow appears to have me covered]\nso after staring a little bit and deciding that I didn't care to understand the math, I tossed the pieces together into a simple class\n\n    class PseudoRandom {\n        private seed: string;\n        private rand: Function;\n\n        constructor(seed: string) {\n            this.seed = seed;\n            let x = this.xmur3(seed);\n            this.rand = this.sfc32(x(), x(), x(), x())\n\n        }\n        next (min: number, max: number): number {\n            return this.rand() * (max - min) + min;\n        }\n\n        nextRand (): number {\n            return this.rand();\n        }\n\n        xmur3(str: string) {\n            for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)\n                h = Math.imul(h ^ str.charCodeAt(i), 3432918353),\n                h = h << 13 | h >>> 19;\n            return function() {\n                h = Math.imul(h ^ h >>> 16, 2246822507);\n                h = Math.imul(h ^ h >>> 13, 3266489909);\n                return (h ^= h >>> 16) >>> 0;\n            }\n        }\n\n        sfc32(a: number, b: number, c: number, d: number) {\n            return function() {\n              a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; \n              var t = (a + b) | 0;\n              a = b ^ b >>> 9;\n              b = c + (c << 3) | 0;\n              c = (c << 21 | c >>> 11);\n              d = d + 1 | 0;\n              t = t + d | 0;\n              c = c + t | 0;\n              return (t >>> 0) / 4294967296;\n            }\n        }\n    }\n\nThen I was able to populate my array data like so\n\n    randomFillMap() {\n        if (this.useRandomSeed) {\n            this.seed = new Date().toString()\n        }\n\n        let pseudoRandom = new PseudoRandom(this.seed);\n\n        /* Random seeding */\n        for (let x = 0; x < this.width; x++) {\n            for (let y = 0; y < this.height; y++) {\n                this.map[x][y] = (pseudoRandom.next(0, 100) < this.randomFillPercent) ? 1 : 0;\n            }\n        }\n    }\n\nFeeling pretty good now, I watched the next few seconds of the video and ran into a new problem. The heck is a [Gizmo]?\nReading the first paragraph of the docs, I found out it's just a debugging tool. So, ignoring that, I continued watching the video \nand implemented the wallcount function and the smoothing function. At that point, I was done besides needing to take the\nyoutube comments about smoothing into consideration, but before that, I really needed to deal with the fact that Cocos\ndoesn't _have_ a Gizmo at all. So, instead, my thought was to use what I learned in the basic game tutorial and make a prefab\nto generate cubes and then pray that I'd be able to set their color in some way.\n\nLuckily, the prefab cube is a 1x1x1 thing which means that it pretty much corresponds to the map we were making. So, this became\nsurprisingly easy:\n\n\n    /* Debugging code */\n    @property({type: Prefab})\n    public cubePrefab: Prefab = null;\n\n    generateCubes() {\n        /* When we generate, remove anything existing */\n        if (!this.cubePrefab) {\n            console.log('No cube prefab set.');\n            return;\n        }\n\n        this.node.removeAllChildren();\n\n        for (let x = 0; x < this.width; x++) {\n            for (let y = 0; y < this.height; y++) {\n                if (this.map[x][y] == 1) {\n                    let block = instantiate(this.cubePrefab);\n                    this.node.addChild(block);\n                    block.setPosition(new Vec3(x, y, 0));\n                }\n            }\n        }\n    }\n\n### Filling in the world with cubes.\n\nWhile easy, finally getting to see my little world of cubes had an unexpected bonus. It also revealed a bug in my code. Specifically, all my map piece\nwere set to 1. This took a long time to figure out. But the basic issue was\n\n    new Array<Array<number>>(this.width).fill(new Array<number>(this.height).fill(0));\n\nisn't apparently the way to create an array. Rather, I needed to do this:\n\n    let mapCopy = []\n    for (let x = 0; x < this.width; x++) {\n        mapCopy.push([]);\n        for (let y = 0; y < this.height; y++) {\n            mapCopy[x][y] = 1;\n        }\n    }\n\nwhat's the difference? I have no idea, but all the MDN documentation I was reading implied that they were the same, so imagine my surprise when \nthis worked and I finally got what I wanted to see:\n\n![Screenshot of generated map](/dev-blog/post-images/following-a-unity-tutorial-in-cocos-creator/generated-map.png \"Map generated by the program\")\n\nWonderful. I was happy this worked out, but unhappy that troubleshooting the weird array initalization problem held me up for another 30 minutes\nor so and that it was now past 1am. Still, another good hour programming session with Cocos, so it felt like I had done alright considering how\nforeign typescript, C#, and all of this stuff generally was to me.\n\n\n[here on Github]:https://github.com/EdgeCaseBerg/cocos-map-generator\n[You can do so here]:https://www.youtube.com/watch?v=v7yyZZjF1z4\n[first video]:https://www.youtube.com/watch?v=v7yyZZjF1z4\n[find the documentation about this]:https://cocos.gitbooks.io/creator-manual/content/en/scripting/reference/attributes.html\n[StackoverFlow appears to have me covered]:https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript\n[Gizmo]:https://docs.unity3d.com/ScriptReference/Gizmos.html\n";e.exports={content:t}}}]);
//# sourceMappingURL=chunk-2d22cc62.369ccb2d.js.map