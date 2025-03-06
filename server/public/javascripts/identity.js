async function loadIdentity() {
    const identity_div = document.getElementById("identity_div");
    const postingSection = document.getElementById("posting-section");
    const previewSection = document.getElementById("preview-section");
    const formElements = document.querySelectorAll("#posting-section input, #posting-section button");

    try {
        let identityInfo = await fetchJSON(`api/${apiVersion}/users/myIdentity`);
        console.log(identityInfo.status);
        if (identityInfo.status === "loggedin") {
            myIdentity = identityInfo.userInfo.username;
            identity_div.innerHTML = `
                <ul>
                    <li><a href="/userInfo.html?user=${encodeURIComponent(identityInfo.userInfo.username)}">${escapeHTML(identityInfo.userInfo.name)} (${escapeHTML(identityInfo.userInfo.username)})</a></li>
                    <li><a href="signout" class="btn btn-danger" role="button">Log out</a></li>
                </ul>`;

            // Enable the form
            formElements.forEach(el => el.disabled = false);
            if (postingSection) postingSection.classList.remove("d-none");
            if (previewSection) previewSection.classList.remove("d-none");
            
            document.body.classList.remove("non-authenticated");
        } else {
            myIdentity = undefined;
            identity_div.innerHTML = `
                <ul>
                    <li><a href="signin" class="login-button" role="button">Log in</a></li>
                </ul>`;
            
            document.body.classList.add("non-authenticated");
            
            const mainElement = document.querySelector("main");
            mainElement.innerHTML = `
                <div class="welcome-container">
                    <div class="welcome-content">
                        <div class="welcome-header">
                            <img src="./images/logo.png" alt="Restaurize Logo" class="welcome-logo">
                            <h1>Welcome to Restaurize</h1>
                        </div>
                    </div>
                    <div class="preview-glimpse">
                        <h2>Restaurant Previews</h2>
                        <div id="sample-restaurants"></div>
                        <div class="blur-overlay">
                            <div class="blur-content">
                                <h3>Access Restaurants</h3>
                                <a href="signin" class="preview-cta-button">Log in</a>
                            </div>
                        </div>
                    </div>
                </div>`;
                
            loadPreviewRestaurants();
        }
    } catch (error) {
        myIdentity = undefined;
        identity_div.innerHTML = `
        <div>
            <button onclick="loadIdentity()">retry</button>
            Error loading identity: <span id="identity_error_span"></span>
        </div>`;
        document.getElementById("identity_error_span").innerText = error;
        formElements.forEach(el => el.disabled = true);
    }
}

/* Testing... Show only the first few restaurants... */
async function loadPreviewRestaurants() {
    try {
        let postsJson = await fetchJSON(`api/${apiVersion}/post`);
        let limitedPosts = postsJson.slice(0, 3);
        
        let postHTML = limitedPosts.map(postInfo => {
            let imageHtml = '';
            if (postInfo.restaurantImage && postInfo.restaurantImage.data) {
                const imageBase64 = postInfo.restaurantImage.data;
                const contentType = postInfo.restaurantImage.contentType || 'image/jpeg';
                imageHtml = `<img src="data:${contentType};base64,${imageBase64}" alt="${postInfo.restaurantName}"/>`;
            } else if (postInfo.restaurantImage) {
                imageHtml = `<img src="${postInfo.restaurantImage}" alt="${postInfo.restaurantName}"/>`;
            } else {
                imageHtml = `<div class="no-image-placeholder">No Image</div>`;
            }

            return (`
                <div class="preview-card">
                    <div class="preview-image">
                        ${imageHtml}
                    </div>
                    <div class="preview-info">
                        <h3>${postInfo.restaurantName}</h3>
                        <p class="preview-location">${postInfo.location}</p>
                    </div>
                </div>
            `);
        });

        const sampleRestaurantsContainer = document.getElementById("sample-restaurants");
        if (sampleRestaurantsContainer) {
            sampleRestaurantsContainer.innerHTML = postHTML.join('');
        }
    } catch (error) {
        console.error("Error loading preview restaurants:", error);
    }
}