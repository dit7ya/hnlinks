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
                console.log(idOfClosestParent);
                linksArray.push({
                    link: links[i].href,
                    idOfClosestParent: idOfClosestParent,
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
        "position: fixed; top:0; right:0; font-family: sans-serif; font-size: 12px; overflow: auto; background-color: white; width: 350px; height: 200px; \
   border: 2px solid red; padding: 20px";

    // and give it some content
    const newContent = document.createTextNode(
        "Enjoy the list of filtered links that appear in this HN thread!"
    );

    // add the text node to the newly created div
    linksDiv.appendChild(newContent);

    for (let i = 0; i < linksArray.length; i++) {
        // TODO REFACTOR THIS ENTIRE BLOCK
        const newP = document.createElement("p");

        const parentCommentID = linksArray[i]["idOfClosestParent"];
        const buttonEl = document.createElement("button");
        buttonEl.onclick = function() {
            document.getElementById(parentCommentID).scrollIntoView();
        };
        // buttonEl.style.cssText = "display:inline-block; padding:0.3em 1.2em; margin:0 0.3em 0.3em 0; border-radius:2em; box-sizing: border-box; text-decoration:none; font-family:'Roboto',sans-serif; font-weight:300; color:#FFFFFF; background-color:#4eb5f1;";

        buttonEl.style.cssText = "border: 1px outset blue; border-radius: 9px; background-color: lightBlue; height:1rem; width:0.8rem; cursor:pointer;";

        newP.appendChild(buttonEl);

        var a = document.createElement("a");
        var linkText = document.createTextNode(linksArray[i]["link"]);
        a.appendChild(linkText);
        a.title = linksArray[i]["link"];
        a.href = linksArray[i]["link"];

        a.style.cssText = "vertical-align: bottom";

        newP.appendChild(a);

        linksDiv.appendChild(newP);
    }
    document.body.appendChild(linksDiv);
}
