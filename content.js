console.log("hnlinks - content script loaded");

const linksArray = createLinksList();
createLinksListElement(linksArray);

// create a function that extracts all external URLs from the page and displays them along with a button to go to the page location where this link appears
// and then creates a nice HTML element with all those links

function checkLink(lnk) {
    // TODO add more filters
    if (
        !lnk.includes("news.ycombinator.com") &&
        !lnk.includes("javascript:void") &&
        !lnk.includes("ycombinator.com")
    ) {
        return true;
    }
}

function createLinksList() {
    let linksArray = [];
    let links = document.getElementsByTagName("a");
    for (let i = 0, max = links.length; i < max; i++) {
        if (checkLink(links[i].href)) {
            try {
                idOfClosestParent = links[i].closest(".comtr").id;
                textOfComment = document
                    .getElementById(idOfClosestParent)
                    .getElementsByClassName("commtext")[0]
                    .innerText.slice(0, -7); // slicing to get rid of the 'reply' text

                console.log(idOfClosestParent);
                linksArray.push({
                    link: links[i].href,
                    idOfClosestParent: idOfClosestParent,
                    commentText: textOfComment,
                });
            } catch (err) {} finally {}
        }
    }
    linksArray.sort((a, b) => a.link.localeCompare(b.link));
    console.log(linksArray);
    return linksArray;
}

function createLinksListElement(linksArray) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "halum";
    linksDiv.style.cssText =
        "position: fixed; top:0; right:0; font-family: sans-serif; font-size: 0.6rem; overflow: auto; background-color: white; width: 350px; height: 200px; \
   border: 2px solid red; padding: 20px";

    // and give it some content
    const newContent = document.createTextNode(
        "Enjoy the list of filtered links that appear in this HN thread!"
    );

    // add the text node to the newly created div
    linksDiv.appendChild(newContent);

    for (let i = 0; i < linksArray.length; i++) {
        // TODO REFACTOR THIS ENTIRE BLOCK
        let newP = document.createElement("p");

        let parentCommentID = linksArray[i]["idOfClosestParent"];
        let buttonEl = document.createElement("button");
        buttonEl.onclick = function() {
            document.getElementById(parentCommentID).scrollIntoView();
        };
        buttonEl.style.cssText =
            "border: 0px outset blue; border-radius: 9px; background-color: #ff6600; height:1rem; width:0.8rem; cursor:pointer;";

        newP.appendChild(buttonEl);

        var a = document.createElement("a");
        var linkText = document.createTextNode(linksArray[i]["link"]);
        a.appendChild(linkText);
        a.title = linksArray[i]["link"];
        a.href = linksArray[i]["link"];
        a.style.cssText = "vertical-align: bottom";
        newP.appendChild(a);

        let nextP = document.createElement("p");
        // TODO contract the comment to two lines or 100 chars or something.

        let t = document.createTextNode(linksArray[i]["commentText"]);
        nextP.appendChild(t);
        newP.appendChild(nextP);

        linksDiv.appendChild(newP);
    }
    document.body.appendChild(linksDiv);
}
