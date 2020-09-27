const linksArray = createLinksList();
createLinksListElement(linksArray);

// Setting this here was easier than using the CSS
document.getElementById("hnmain").width = "70%";
document.getElementById("hnmain").align = "left";

// create a function that extracts all external URLs from the page and displays them along with a button to go to the page location where this link appears
// and then creates a nice HTML element with all those links

function checkLink(lnk) {
    // TODO This is not required anymore since we are only looping inside the comments
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

                linksArray.push({
                    link: links[i].href,
                    idOfClosestParent: idOfClosestParent,
                    commentText: textOfComment,
                });
            } catch (err) {} finally {}
        }
    }
    linksArray.sort((a, b) => a.link.localeCompare(b.link));
    return linksArray;
}

function createLinksListElement(linksArray) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "linksDiv";

    const instructionsText = document.createTextNode(
        "Click on a comment text to focus on that comment in the thread. "
    );

    linksDiv.appendChild(instructionsText);

    const hr = document.createElement("hr");
    linksDiv.appendChild(hr);

    for (let i = 0; i < linksArray.length; i++) {
        // TODO REFACTOR THIS ENTIRE BLOCK
        let linkBlock = document.createElement("div");
        let parentCommentID = linksArray[i]["idOfClosestParent"];

        let linkHeader = document.createElement("a");
        let linkText = document.createTextNode(linksArray[i]["link"]);

        linkHeader.appendChild(linkText);
        linkHeader.title = linksArray[i]["link"];
        linkHeader.href = linksArray[i]["link"];
        linkHeader.target = "_blank";

        linkBlock.appendChild(linkHeader);

        let linkComment = document.createElement("p");
        // TODO contract the comment to two lines or 100 chars or something.

        let linkCommentText = document.createTextNode(linksArray[i]["commentText"]);
        linkComment.appendChild(linkCommentText);
        linkComment.style.cssText = "cursor: pointer;";
        linkComment.onclick = function() {
            document.getElementById(parentCommentID).scrollIntoView();
        };

        linkBlock.appendChild(linkComment);
        linksDiv.appendChild(linkBlock);
    }
    document.body.appendChild(linksDiv);
}
