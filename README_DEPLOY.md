# Akshay Sant portfolio — publishing instructions

This is a static website. It does not require a database, paid server, or build command.

## Fastest deployment: Netlify Drop

1. Unzip `Akshay_Sant_Portfolio.zip`.
2. Open https://app.netlify.com/drop in a browser.
3. Drag the entire `akshay_portfolio` folder onto the page.
4. Netlify will create a public HTTPS address immediately.
5. In Netlify, use **Site configuration → Change site name** to choose a cleaner free address.

The site can be updated later by dragging the revised folder into the site’s **Deploys** page.

## GitHub Pages alternative

1. Create a new public GitHub repository.
2. Upload every file from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then select the `main` branch and `/ (root)`.
5. Save. GitHub will publish the site after a short build.

## Editing the content

- Main page content: `index.html`
- Colors, typography, and layout: `styles.css`
- Mobile navigation and reveal effects: `script.js`
- Downloadable CV: `Akshay_Sant_CV_2026.pdf`
- Editable CV source: `source/Akshay_Sant_CV_2026.tex`

The website uses no paid assets and no external JavaScript or font dependencies.
