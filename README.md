# BCC Drophere Front End Repository

Drophere is a web-based application which is mainly used for file submission. Built with React JS and styled with SASS. The components is provided by [BCC Design System](https://github.com/bccfilkom/designsystem). 

## Project Structure
- ``src/components/common`` contains all general components
- ``src/components/panel`` contains all main screens and its related components. This directory consists of 3 folders, ``Home`` for the public accessed pages, ``Account`` for the private accessed pages, and ``Drop`` for the file submission page.
- ``src/contexts`` contains all methods and states that used by multiple components
- ``src/assets`` contains all assets such as pictures and fonts
- ``src/css`` contains styling files
- ``src/utils`` contains utility and helper functions

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install this repo on your computer.

```bash
yarn
```

## Contributing
We really appreciate your help and contribution. In order to contribute, please follow this following instruction:
1. Clone this repo on your local computer by typing `git clone https://github.com/bccfilkom/drophere-frontend.git` in your terminal
2. Make a new branch for your feature/fix with ``git checkout -b <yourbranchname>`` Example: ``git checkout -b add-multiplefiles-submission``
3. `git add .` to add all the modified and new files to the staging area
4. `git commit -m "your message here"` to commit your changes
5. `git push -u origin <yourbranchname>`to push to this remote repo
6. Visit the GitHub repo page, make a pull request from your branch to master
7. Please kindly wait for us to review and approve your pull request
8. Once your pull request is approved, your code will be built and immediately deployed on https://drophere.bccfilkom.net