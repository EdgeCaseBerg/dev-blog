const content = `
## Saving progress in a flashcard app in 1 value

### Some context

I've been taking Japanese classes for a while, and since the pandemic killed my need to commute, I fell out of making physical flash cards to study with.
However, a little while ago I decided that when I'm sitting around watching youtube or a stream on one monitor, I could be studying flashcards on the other
if I made an app. So, I made [a study application] for myself and my classmates to use as a study aid. It works well enough, but one thing started bothering
me once I had made over a few hundred cards is that I wouldn't get through them in in one study session and wished I could pick up where I left off.

That said, it's a static website, I'm not going to add a database because I have no interest in storing my or my classmates progress or use of the app in any form.
So, the only way to store information is in a cookie or in local storage. I'm a dinosaur, so I decided to just toss a value into a cookie and call it a day instead
of using all that fancy pants local storage stuff the kids like to use now-a-days. Why bother when a cookie will work?

### Encoding seen cards into a bitstring

I don't have any sort of ID system for the flashcards. And even if I did, I wouldn't want to store every single ID into a cookie because cookies are limited in size.
A simple solution then is to encode what we've seen into a bitstring. With active bits indicating that a given card was seen. Then, we only need as many bits as cards.
Since the bitstring can be converted into a number, it _should_ be storable within a cookie without too much trouble. Lucky for me, since it's a static site, the list
of flashcards is a known quantity, and the way the app works is that the large list of cards is copied to a temporary copy that we remove cards from as the user clicks
through them. So, the bitstring can indicate the index that has been seen already.

Here's an example, let's say you have the following cards:

    ['a', 'b', 'c', 'd']

If a user is shown c, then we add its index to our list of seen values which would become \`[2]\`. If we encode this then we'd expect the bitstring of \`100\`, or 4.
If you were to encode that we clicked on both a and c? \`101\` or 5. There's a pattern here that's pretty obvious if you're familiar with bitstrings or just dealing
in powers of 2. The trick of course is that this works fine in javascript until you get past index 32 or so. At which point, JavaScript's hatred of numbers seems to
pop up and you're suddenly looking at imprecise scientific notation of our numbers like 2.2397447421778042e+102. Which is a bit of a pain to use.

### BigInteger usage solves the issue!

Luckily for us, handling large numbers is pretty easy to deal with if we use something like the [jsbn] library that gets us the same interface as Java's BigInteger
class. It's even easier when you realize that someone has kindly packaged [jsbn for npm] so we can include it in the Vue project we're using. That library was 
at the top of the recommendation in a [great comparison on stackoverflow between BigInteger libraries], and it was easy enough to use since I'm familiar with Java's.
Overall, it took less than an hour to implement this with only minor headscratching. 

### The general flow and the code

The [code update is here] if you want to see it. There's not too much to say about it, the code pretty much speaks for itself:

1. Application loads and Vue mounts components.
2. Is there a cookie value saved?
    1. Assuming Yes, decode the BigInteger's bitstring into an array of indices
    2. Filter the starting cards for the app to only include values that don't match the saved indices
3. Load the first card and save its index into the seen list and cookie encoded value

The saved data will stick around in the cookie for 30 days and then expire. If you're not through the flashcards within 30 days, you should probably start over!
The two meaty functions are here:

    encodeSeen () {
        let bitString = new BigInteger('0')
        for (let index = 0; index < this.seen.length; index++) {
            const indexSeen = this.seen[index]
            const bitToEnable = new BigInteger('2').pow(indexSeen)
            bitString += bitToEnable
        }
        return bitString
    },
    decodeCodeSeen: function (bigInteger) {
        const bitString = bigInteger.toString(2)
        const decodedSeen = []
        for (let index = bitString.length - 1; index >= 0; index--) {
            const element = bitString[index]
            if (element === '1') {
                decodedSeen.push(bitString.length - 1 - index)
            }
        }
        return decodedSeen
    }

and the kick off function for the component is

    created () {
        this.cards = originals
        if (this.cookie) {
          const encodedSeen = new BigInteger(this.cookie)
          this.seen = this.decodeCodeSeen(encodedSeen)
          /* We now have indices we've seen before, so make a version of the originals that has these removed */
          this.flashcards = this.cards.filter((value, index) => {
            return this.seen.indexOf(index) === -1
          })
        }
        this.getCard()
      }

To fully understand this, you'll need to look at the code itself on github. But if you're trying to get an idea of how to use 
BigInteger to encode some data into a bitstring, this will probably be enough to get you started. Enjoy.

[a study application]:http://www.bsyjpncards.org/
[great comparison on stackoverflow between BigInteger libraries]:https://stackoverflow.com/questions/4288821/how-to-deal-with-big-numbers-in-javascript
[jsbn]:http://www-cs-students.stanford.edu/~tjw/jsbn/
[jsbn for npm]:https://www.npmjs.com/package/jsbn
[cookie documentation]:https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#examples
[code update is here]:https://github.com/EdgeCaseBerg/bsyjpncards.org/commit/2cb78d4bd08ecc4a7b890324e098cad6c2b8736b

`;
module.exports = {
  content
};