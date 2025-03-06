let myIdentity = undefined;

async function loadIdentity() {
    const identity_div = document.getElementById("identity_div");
    const postingSection = document.getElementById("posting-section");
    const restaurantCardsContainer = document.getElementById("preview-section");
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
            if (restaurantCardsContainer) restaurantCardsContainer.classList.remove("d-none");
        } else {
            myIdentity = undefined;
            identity_div.innerHTML = `
                <ul>
                    <li><a href="signin" class="btn btn-primary" role="button" style="color: red;">Log in</a></li>
                </ul>`;

            // Disable the form but keep it visible
            formElements.forEach(el => el.disabled = true);

            // Keep the restaurant section visible and only modify the right side
            if (postingSection) {
                postingSection.classList.remove("d-none");
                postingSection.innerHTML = `
                    <div class="form-container" style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h2>Restaurant Information</h2>
                            <form>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="restaurantName">Restaurant Name</label>
                                        <input type="text" id="restaurantName" name="restaurantName" disabled>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="restaurantPhoneNum">Phone Number</label>
                                        <input type="tel" id="restaurantPhoneNum" name="restaurantPhoneNum" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label for="restaurantMenu">Restaurant Menu</label>
                                        <input type="text" id="restaurantMenu" name="restaurantMenu" disabled>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="location">Location</label>
                                        <input type="text" id="location" name="location" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label for="operationHours">Operation Hours</label>
                                        <input type="text" id="operationHours" name="operationHours" disabled>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="restaurantCapacity">Restaurant Capacity</label>
                                        <input type="text" id="restaurantCapacity" name="restaurantCapacity" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label for="restaurantRevenue">Restaurant Revenue</label>
                                        <input type="text" id="restaurantRevenue" name="restaurantRevenue" disabled>
                                    </div>
                                </div>
                                <div class="form-group submit-group">
                                    <button type="submit" disabled>Submit</button>
                                </div>
                            </form>
                        </div>
                        <div style="width: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 2px solid #ff4d4d; border-radius: 10px; padding: 10px; background: #fff3f3; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                            <p style="font-size: 1.1em; color: #d9534f;">Log in to manage restaurants.</p>
                        </div>
                    </div>`;
            }
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
