browser.runtime.onMessage.addListener(() => {
  toggleSidebar();
  return Promise.resolve({
    response: 'Msg from content script.'
  });
});

const toggleSidebar = () => {
  const hnmain = document.getElementById('hnmain');
  const linksDiv = document.getElementsByClassName('linksDiv')[0];
  if (hnmain.align === 'left') {
    linksDiv.style.display = 'none';
    hnmain.width = '85%';
    hnmain.align = 'center';
  } else {
    linksDiv.style.display = 'initial';
    hnmain.width = '70%';
    hnmain.align = 'left';
    hnmain.style.minWidth = 0;
  }
};

const openCollapsed = (commID) => {

  if (document.getElementById(commID).classList.contains('coll')) {
    document.getElementById(commID).getElementsByClassName('togg')[0].click();
  }
};

const openParentCommentsTillRoot = (commID) => {
  // indentation of the given comment
  const indWidth = document
    .getElementById(commID)
    .getElementsByClassName('ind')[0]
    .getElementsByTagName('img')[0].width;

  let currentCommID = commID;

  while (
    document
      .getElementById(currentCommID)
      .getElementsByClassName('ind')[0]
      .getElementsByTagName('img')[0].width > 0
  ) {
    // open the current comment
    openCollapsed(currentCommID);

    // find the prev comm and set that for currentCommID
    // TODO ignore prev comment if it is on the same level
    const prevComm = document.getElementById(currentCommID).previousElementSibling;
    currentCommID = prevComm.id;
  }

  // open the root comment (indWidth = 0)
  openCollapsed(currentCommID);
};

const fetchSearchResultsAndAppend = async (queryURL, previousStories) => {
  try {
    const response = await fetch(queryURL);
    const data = await response.json();
    if (await data.nbHits) {
      const previousSection = document.createElement('details');
      previousSection.className = 'previousSection';
      const summary = document.createElement('summary');
      summary.innerHTML = 'elsewhere on HN';
      previousSection.appendChild(summary);

      // const linksList = document.createElement('li');

      for (const item of data.hits) {
        const linkTitle = item.title;
        const numComments = item.num_comments;
        const points = item.points;
        const hnCommentsURL =
          'https://news.ycombinator.com/item?id=' + item.objectID;

        const urlElement = document.createElement('a');
        urlElement.title = linkTitle;
        urlElement.href = hnCommentsURL;
        urlElement.target = '_blank';
        urlElement.className = 'urlElement';

        const urlPoints = document.createElement('text');
        urlPoints.textContent = '▲ ' + points;

        // urlPoints.innerHTML =
        // "<span>▲ " + points + "</span>";

        urlPoints.className = 'urlPoints';

        const urlComments = document.createElement('text');
        urlComments.textContent = '🗩 ' + numComments;

        urlComments.className = 'urlComments';

        urlElement.textContent = linkTitle;

        // let urlText = document.createTextNode(linkTitle);
        // urlElement.appendChild(urlText);

        const urlElementP = document.createElement('p');

        urlElementP.appendChild(urlElement);
        urlElementP.appendChild(urlPoints);
        urlElementP.appendChild(urlComments);

        previousSection.appendChild(urlElementP);
      }

      previousStories.appendChild(previousSection);
    }
  } catch (err) {
    console.log(err);
  }
};

const createLinksArray = () => {
  // TODO change name to object THINK AGAIN
  const linksArray = [];

  // Select all elements inside commtext classes whose href attribute begins with "http"
  // This selects for both http and https links
  const links = document.querySelectorAll('.commtext a[href^="http"]');

  for (let i = 0, max = links.length; i < max; i++) {
    const idOfClosestParent = links[i].closest('.comtr').id;

    let textOfComment = document
      .getElementById(idOfClosestParent)
      .getElementsByClassName('commtext')[0].innerText;

    // If it is a multiline comment the innerText contains "reply". We remove that.
    if (textOfComment.endsWith('reply')) {
      textOfComment = textOfComment.slice(0, -7);
    }

    linksArray.push({
      link: links[i].href,
      idOfClosestParent: idOfClosestParent,
      commentText: textOfComment
    });
  }

  // Sort the Array so that same domains are grouped together.
  linksArray.sort((a, b) => {
    return a.link.localeCompare(b.link);
  });
  return linksArray;
};

function createLinksArrayElement (linksArray) {
  const linksDiv = document.createElement('div');
  linksDiv.className = 'linksDiv';

  // The instructions Header
  const instructionsText = document.createTextNode(
    "Click on a comment text to focus on that comment in the thread. If a link has been posted as a HN story before, click on 'Elsewhere on HN' to see those."
  );

  linksDiv.appendChild(instructionsText);

  // One horizontal separator
  const hr = document.createElement('hr');
  linksDiv.appendChild(hr);

  for (let i = 0; i < linksArray.length; i++) {
    const linkBlock = document.createElement('div');
    const parentCommentID = linksArray[i].idOfClosestParent;

    const linkHeader = document.createElement('a');
    // let linkText = document.createTextNode(linksArray[i]["link"]);

    // linkHeader.textContent = (i+1) + ". " + linksArray[i]["link"];
    linkHeader.textContent = linksArray[i].link;
    // linkHeader.appendChild(linkText);
    linkHeader.title = linksArray[i].link;
    linkHeader.href = linksArray[i].link;
    linkHeader.target = '_blank';

    linkBlock.appendChild(linkHeader);

    const linkComment = document.createElement('p');
    linkComment.className = 'linkComment';
    linkComment.textContent = linksArray[i].commentText;

    // let linkCommentText = document.createTextNode(linksArray[i]["commentText"]);
    // linkComment.appendChild(linkCommentText);
    linkComment.onclick = function () {
      openParentCommentsTillRoot(parentCommentID);
      document.getElementById(parentCommentID).scrollIntoView();
    };

    linkBlock.appendChild(linkComment);

    const previousStories = document.createElement('div');
    previousStories.className = 'previousStories';

    const url = linksArray[i].link.split('#')[0];
    const queryURL =
      'http://hn.algolia.com/api/v1/search?query=' +
      url +
      '&tags=story&restrictSearchableAttributes=url';

    // FIXME this only retrives the first 20 search results (which is fine for the time being, I think)

    fetchSearchResultsAndAppend(queryURL, previousStories);

    linksDiv.appendChild(linkBlock);
    // TODO Check whether to append to linkBlock instead
    linksDiv.appendChild(previousStories);
  }
  document.body.appendChild(linksDiv);
}

const linksArray = createLinksArray();
createLinksArrayElement(linksArray);
toggleSidebar();

// Ellipsify the comment texts to three lines

$readMoreJS.init({
  target: '.linkComment',
  numOfWords: 40, // Number of words to initially display.
  toggle: true, // If true, user can toggle between 'read more' and 'read less'
  moreLink: 'more...', // The text of 'Read more' link.
  lessLink: 'less', // The text of 'Read less' link.
  linkClass: 'rm-link', // The class given to the read more link.
  containerClass: 'rm-container' // The class given to the div container of the read more link.
});
