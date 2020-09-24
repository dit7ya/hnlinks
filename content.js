// console.log("hnlinks - content script loaded");

const linksArray = createLinksList();
createLinksListElement(linksArray);

document.getElementById("hnmain").width = "70%";
document.getElementById("hnmain").align = "left";

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

                // console.log(idOfClosestParent);
                linksArray.push({
                    link: links[i].href,
                    idOfClosestParent: idOfClosestParent,
                    commentText: textOfComment,
                });
            } catch (err) {} finally {}
        }
    }
    linksArray.sort((a, b) => a.link.localeCompare(b.link));
    // console.log(linksArray);
    return linksArray;
}

function createLinksListElement(linksArray) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "halum";
    linksDiv.style.cssText =
        "position: fixed; top:0; right:0; bottom:0; font-family: sans-serif; font-size: 0.7rem; overflow: auto; background-color: white; width: 27%; height: max-content; \
   border: 2px solid #ff6600; margin: 0.5rem; padding: 0.5rem;";

    // and give it some content
    const newContent = document.createTextNode(
        "Click on a comment text to focus on that comment in the thread. "
    );

    // add the text node to the newly created div
    linksDiv.appendChild(newContent);

    const hr = document.createElement("hr");
    hr.style.cssText = "border: 0.5px solid grey";
    linksDiv.appendChild(hr);

    for (let i = 0; i < linksArray.length; i++) {
        // TODO REFACTOR THIS ENTIRE BLOCK
        let newP = document.createElement("p");

        // const buttonIcon = document.createElement('h');
        // const icon = document.createTextNode("🔴");
        // buttonIcon.onclick = function() {
        //         document.getElementById(parentCommentID).scrollIntoView();
        //     };

        // buttonIcon.appendChild(icon);
        // buttonIcon.style.cssText = "cursor:pointer;";

        // newP.appendChild(buttonIcon);

        let parentCommentID = linksArray[i]["idOfClosestParent"];

        // let buttonEl = document.createElement("button");
        // buttonEl.onclick = function() {
        //     document.getElementById(parentCommentID).scrollIntoView();
        // };
        // buttonEl.style.cssText =
        //     "border: 0px outset blue; border-radius: 9px; background-color: #ff6600; height:1rem; width:0.8rem; cursor:pointer;";

        // newP.appendChild(buttonEl);

        var a = document.createElement("a");
        var linkText = document.createTextNode(" ".concat(linksArray[i]["link"]));
        a.appendChild(linkText);
        a.title = linksArray[i]["link"];
        a.href = linksArray[i]["link"];
        a.target = "_blank";
        a.style.cssText = "font-size: 110%; text-decoration: underline solid black";
        // a.style.cssText = "font-size: 110%";
        newP.appendChild(a);

        let nextP = document.createElement("p");
        // TODO contract the comment to two lines or 100 chars or something.

        let t = document.createTextNode(linksArray[i]["commentText"]);
        nextP.appendChild(t);
        nextP.style.cssText = "cursor: pointer;";
        nextP.onclick = function() {
            document.getElementById(parentCommentID).scrollIntoView();
        };


        newP.appendChild(nextP);

        linksDiv.appendChild(newP);
    }
    document.body.appendChild(linksDiv);
}
