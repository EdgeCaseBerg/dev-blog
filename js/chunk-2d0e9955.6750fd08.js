(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e9955"],{"8dc6":function(e,n){var t="\n## Saving progress in a flashcard app in 1 value\n\n### Some context\n\nI've been taking Japanese classes for a while, and since the pandemic killed my need to commute, I fell out of making physical flash cards to study with.\nHowever, a little while ago I decided that when I'm sitting around watching youtube or a stream on one monitor, I could be studying flashcards on the other\nif I made an app. So, I made [a study application] for myself and my classmates to use as a study aid. It works well enough, but one thing started bothering\nme once I had made over a few hundred cards is that I wouldn't get through them in in one study session and wished I could pick up where I left off.\n\nThat said, it's a static website, I'm not going to add a database because I have no interest in storing my or my classmates progress or use of the app in any form.\nSo, the only way to store information is in a cookie or in local storage. I'm a dinosaur, so I decided to just toss a value into a cookie and call it a day instead\nof using all that fancy pants local storage stuff the kids like to use now-a-days. Why bother when a cookie will work?\n\n### Encoding seen cards into a bitstring\n\nI don't have any sort of ID system for the flashcards. And even if I did, I wouldn't want to store every single ID into a cookie because cookies are limited in size.\nA simple solution then is to encode what we've seen into a bitstring. With active bits indicating that a given card was seen. Then, we only need as many bits as cards.\nSince the bitstring can be converted into a number, it _should_ be storable within a cookie without too much trouble. Lucky for me, since it's a static site, the list\nof flashcards is a known quantity, and the way the app works is that the large list of cards is copied to a temporary copy that we remove cards from as the user clicks\nthrough them. So, the bitstring can indicate the index that has been seen already.\n\nHere's an example, let's say you have the following cards:\n\n    ['a', 'b', 'c', 'd']\n\nIf a user is shown c, then we add its index to our list of seen values which would become `[2]`. If we encode this then we'd expect the bitstring of `100`, or 4.\nIf you were to encode that we clicked on both a and c? `101` or 5. There's a pattern here that's pretty obvious if you're familiar with bitstrings or just dealing\nin powers of 2. The trick of course is that this works fine in javascript until you get past index 32 or so. At which point, JavaScript's hatred of numbers seems to\npop up and you're suddenly looking at imprecise scientific notation of our numbers like 2.2397447421778042e+102. Which is a bit of a pain to use.\n\n### BigInteger usage solves the issue!\n\nLuckily for us, handling large numbers is pretty easy to deal with if we use something like the [jsbn] library that gets us the same interface as Java's BigInteger\nclass. It's even easier when you realize that someone has kindly packaged [jsbn for npm] so we can include it in the Vue project we're using. That library was \nat the top of the recommendation in a [great comparison on stackoverflow between BigInteger libraries], and it was easy enough to use since I'm familiar with Java's.\nOverall, it took less than an hour to implement this with only minor headscratching. \n\n### The general flow and the code\n\nThe [code update is here] if you want to see it. There's not too much to say about it, the code pretty much speaks for itself:\n\n1. Application loads and Vue mounts components.\n2. Is there a cookie value saved?\n    1. Assuming Yes, decode the BigInteger's bitstring into an array of indices\n    2. Filter the starting cards for the app to only include values that don't match the saved indices\n3. Load the first card and save its index into the seen list and cookie encoded value\n\nThe saved data will stick around in the cookie for 30 days and then expire. If you're not through the flashcards within 30 days, you should probably start over!\nThe two meaty functions are here:\n\n    encodeSeen () {\n        let bitString = new BigInteger('0')\n        for (let index = 0; index < this.seen.length; index++) {\n            const indexSeen = this.seen[index]\n            const bitToEnable = new BigInteger('2').pow(indexSeen)\n            bitString += bitToEnable\n        }\n        return bitString\n    },\n    decodeCodeSeen: function (bigInteger) {\n        const bitString = bigInteger.toString(2)\n        const decodedSeen = []\n        for (let index = bitString.length - 1; index >= 0; index--) {\n            const element = bitString[index]\n            if (element === '1') {\n                decodedSeen.push(bitString.length - 1 - index)\n            }\n        }\n        return decodedSeen\n    }\n\nand the kick off function for the component is\n\n    created () {\n        this.cards = originals\n        if (this.cookie) {\n          const encodedSeen = new BigInteger(this.cookie)\n          this.seen = this.decodeCodeSeen(encodedSeen)\n          /* We now have indices we've seen before, so make a version of the originals that has these removed */\n          this.flashcards = this.cards.filter((value, index) => {\n            return this.seen.indexOf(index) === -1\n          })\n        }\n        this.getCard()\n      }\n\nTo fully understand this, you'll need to look at the code itself on github. But if you're trying to get an idea of how to use \nBigInteger to encode some data into a bitstring, this will probably be enough to get you started. Enjoy.\n\n[a study application]:http://www.bsyjpncards.org/\n[great comparison on stackoverflow between BigInteger libraries]:https://stackoverflow.com/questions/4288821/how-to-deal-with-big-numbers-in-javascript\n[jsbn]:http://www-cs-students.stanford.edu/~tjw/jsbn/\n[jsbn for npm]:https://www.npmjs.com/package/jsbn\n[cookie documentation]:https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#examples\n[code update is here]:https://github.com/EdgeCaseBerg/bsyjpncards.org/commit/2cb78d4bd08ecc4a7b890324e098cad6c2b8736b\n\n";e.exports={content:t}}}]);
//# sourceMappingURL=chunk-2d0e9955.6750fd08.js.map