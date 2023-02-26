
#

 In following tutorial, you will learn how to make full functional helloworld application quickly using JSactions Appstarter boilerplate code.

## Using JSactions App Starter Boilerplate

Appstarter have sample code for :

- Creating Custom Component Button using JSactions Component.

- Creating HellowWorld View Screen (page) with ViewNavigator and Viewmnager.

- Configuring Router path and Event router to browse ViewNavigator and HelloWorld View.

- Creating Model for View data and state management.

- Passing View parameter during navigation event
- Binding custom Component click event using model and BindingUtils
- Binding Component Custom Property using Model and BindingUtils.

### Typical UI Application structure vs JSactions Appstarter Application structure

- Typical UI application requirement statement :
    **Hello World Application on start should navigate to "HelloWorld" page.**

- Typical UI application layout as per above requirment illustrated in below image :</br></br>
    ![picture](images/typical-app-layout.png)

- Equivalent JSactions Application Structure as per above requirment illustrated in below image :</br></br>
    ![picture](images/jsactions-app-layout.png)

### Install and Running Helloworld Example

   Use JSactions App Starter to quickly start building JSactions application. It includes prebuild application structure and tooling of Rollup , Babel. For application development example codes such as Helloworld View, Simple Navigator and Custom Button Component.

- Prerequisite </br>
   Nodejs 8 and Above.
   Code Editor : Visual Studio Code

- Getting code </br>
  Download or clone App starter code from github url : [https://github.com/jsactions/jsactionsappstarter](https://github.com/jsactions/jsactionsappstarter)
If downloaded then Extract Zip Folder
  
- Installation

    ```javascript
    c:\jsactionsappstarter\npm install
    ```

- Compiling

     ```javascript
      c:\jsactionsappstarter\npm run build  
    ```

- Running Application </br>
 After compilation successfully following log  will appear on command line.
  
  ```cmd
    ./src/index.js → dist/jsactionsappstarter.js
    http://localhost:10002 -> C:\jsactionsappstarter
  ```

- Application Preview </br>
  Now in browser type "<http://localhost:10002"> to open Application (see preview below)

  ![picture](images/jsactionsappstarter.gif)
