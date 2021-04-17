# Github Actions 初阶入门

> 在 GitHub Actions 的仓库中自动化、自定义和执行软件开发工作流程。 您可以发现、创建和共享操作以执行您喜欢的任何作业（包括 CI/CD），并将操作合并到完全自定义的工作流程中。



### 关于持续集成

持续集成 (CI) 是一种需要频繁提交代码到共享仓库的软件实践。 频繁提交代码能较早检测到错误，减少在查找错误来源时开发者需要调试的代码量。 频繁的代码更新也更便于从软件开发团队的不同成员合并更改。 这对开发者非常有益，他们可以将更多时间用于编写代码，而减少在调试错误或解决合并冲突上所花的时间。

提交代码到仓库时，可以持续创建并测试代码，以确保提交未引入错误。 您的测试可以包括代码`语法检查（检查样式格式）`、`安全性检查`、`代码覆盖率`、`功能测试`及`其他自定义检查`。

创建和测试代码需要服务器。 您可以在推送代码到仓库之前在本地创建并测试更新，也可以使用 CI 服务器检查仓库中的新代码提交。



### Github Actions的持续集成

使用 GitHub Actions 的 CI 提供可以在仓库中构建代码并运行测试的工作流程。 工作流程可在 GitHub 托管的虚拟机或您自行托管的机器上运行。

您可以配置 CI 工作流程在 GitHub 事件发生时运行（例如，当新代码推送到您的仓库时）、按设定的时间表运行，或者在使用仓库分发 web 挂钩的外部事件发生时运行。

GitHub 运行 CI 测试并在拉取请求中提供每次测试的结果，因此您可以查看分支中的更改是否引入错误。 如果工作流程中的所有 CI 测试通过，您推送的更改可供团队成员审查或合并 如果测试失败，则是其中某项更改导致了失败。

如果在仓库中设置了 CI，GitHub 会分析仓库中的代码，并根据仓库中的语言和框架推荐 CI 工作流程。 例如，如果您使用 [Node.js](https://nodejs.org/en/)，GitHub 将提议使用模板文件来安装 Node.js 包和运行测试。 您可以使用 GitHub 提议的 CI 工作流程模板，自定义提议的模板，或者创建自定义工作流程文件来运行 CI 测试。



![提议的持续集成模板截屏](https://docs.github.com/assets/images/help/repository/ci-with-actions-template-picker.png)



除了帮助设置项目的 CI 工作流程之外，您还可以使用 GitHub Actions 创建跨整个软件开发生命周期的工作流程。 例如，您可以使用操作来`部署`、`封装`或`发行项目`。



​	

### 基本概念

GitHub Actions 有一些自己的术语。

（1）**workflow** （工作流程）：持续集成一次运行的过程，就是一个 workflow。

（2）**job** （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。

（3）**step**（步骤）：每个 job 由多个 step 构成，一步步完成。

（4）**action** （动作）：每个 step 可以依次执行一个或多个命令（action）。



### workflow 文件

GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的`.github/workflows`目录。

workflow 文件采用 [YAML 格式](http://www.ruanyifeng.com/blog/2016/07/yaml.html)，文件名可以任意取，但是后缀名统一为`.yml`，比如`foo.yml`。一个库可以有多个 workflow 文件。GitHub 只要发现`.github/workflows`目录里面有`.yml`文件，就会自动运行该文件。

workflow 文件的配置字段非常多，详见[官方文档](https://help.github.com/en/articles/workflow-syntax-for-github-actions)。下面是一些基本字段。

**（1）`name`**

`name`字段是 workflow 的名称。如果省略该字段，默认为当前 workflow 的文件名。

> ```bash
> name: GitHub Actions Demo
> ```

**（2）`on`**

`on`字段指定触发 workflow 的条件，通常是某些事件。

> ```bash
> on: push
> ```

上面代码指定，`push`事件触发 workflow。

`on`字段也可以是事件的数组。

> ```bash
> on: [push, pull_request]
> ```

上面代码指定，`push`事件或`pull_request`事件都可以触发 workflow。

完整的事件列表，请查看[官方文档](https://help.github.com/en/articles/events-that-trigger-workflows)。除了代码库事件，GitHub Actions 也支持外部事件触发，或者定时运行。

**（3）`on.<push|pull_request>.<tags|branches>`**

指定触发事件时，可以限定分支或标签。

> ```bash
> on:
>   push:
>     branches:    
>       - master
> ```

上面代码指定，只有`master`分支发生`push`事件时，才会触发 workflow。

**（4）`jobs.<job_id>.name`**

workflow 文件的主体是`jobs`字段，表示要执行的一项或多项任务。

`jobs`字段里面，需要写出每一项任务的`job_id`，具体名称自定义。`job_id`里面的`name`字段是任务的说明。

> ```javascript
> jobs:
>   my_first_job:
>     name: My first job
>   my_second_job:
>     name: My second job
> ```

上面代码的`jobs`字段包含两项任务，`job_id`分别是`my_first_job`和`my_second_job`。

**（5）`jobs.<job_id>.needs`**

`needs`字段指定当前任务的依赖关系，即运行顺序。

> ```javascript
> jobs:
>   job1:
>   job2:
>     needs: job1
>   job3:
>     needs: [job1, job2]
> ```

上面代码中，`job1`必须先于`job2`完成，而`job3`等待`job1`和`job2`的完成才能运行。因此，这个 workflow 的运行顺序依次为：`job1`、`job2`、`job3`。

**（6）`jobs.<job_id>.runs-on`**

`runs-on`字段指定运行所需要的虚拟机环境。它是必填字段。目前可用的虚拟机如下。

> - `ubuntu-latest`，`ubuntu-18.04`或`ubuntu-16.04`
> - `windows-latest`，`windows-2019`或`windows-2016`
> - `macOS-latest`或`macOS-10.14`

下面代码指定虚拟机环境为`ubuntu-18.04`。

> ```javascript
> runs-on: ubuntu-18.04
> ```

**（7）`jobs.<job_id>.steps`**

`steps`字段指定每个 Job 的运行步骤，可以包含一个或多个步骤。每个步骤都可以指定以下三个字段。

> - `jobs.<job_id>.steps.name`：步骤名称。
> - `jobs.<job_id>.steps.run`：该步骤运行的命令或者 action。
> - `jobs.<job_id>.steps.env`：该步骤所需的环境变量。

下面是一个完整的 workflow 文件的范例。

> ```javascript
> name: Greeting from Mona
> on: push
> 
> jobs:
>   my-job:
>     name: My Job
>     runs-on: ubuntu-latest
>     steps:
>     - name: Print a greeting
>       env:
>         MY_VAR: Hi there! My name is
>         FIRST_NAME: Mona
>         MIDDLE_NAME: The
>         LAST_NAME: Octocat
>       run: |
>         echo $MY_VAR $FIRST_NAME $MIDDLE_NAME $LAST_NAME.
> ```

上面代码中，`steps`字段只包括一个步骤。该步骤先注入四个环境变量，然后执行一条 Bash 命令。

### 实例：Vue 项目发布到 GitHub Pages

下面是一个实例，通过Vue Cli新建了一个Vue项目，上传到Github仓库后通过Github Actions 发布到Github Page。参考地址：https://github.com/jardenliu/vue-github-action-example.git



![image](https://user-images.githubusercontent.com/15191056/106869134-842fef80-670a-11eb-934e-5e1477da7ad3.png)




#### 第一步：新建项目

```
$ vue create vue-github-action-example
$ cd vue-github-action-example
```

#### 第二步：设置编译配置

因为vue脚手架默认生成的`public path` 是 "/" .在Github Page的地址路径不是从根目录开始。所以修改成相对路径

项目根目录下添加`vue.config.js`.内容如下：

```javascript
module.exports = {
  publicPath: "./",
};
```

#### 第三步：上传项目到Github仓库

```
git remote add origin https://github.com/[username]/[repo].git
git push -u origin master
```

#### 第四步：添加Action 工作流文件

![image](https://user-images.githubusercontent.com/15191056/106869782-4bdce100-670b-11eb-9822-9e72f7f4f01c.png)


点击`set up this workflow` 新建`gh-page.yml`文件

![image](https://user-images.githubusercontent.com/15191056/106869855-5f884780-670b-11eb-9d13-b5829bcdc98c.png)


添加内容：

```
name: deploy gh-pages
on:
  tag:
    branches: [master]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Node.js environment
        uses: actions/setup-node@v2.1.3
        with:
          Version: "14"
      
      - name: checkout
        uses: actions/checkout@v2
      
      - name: install deps
        run: npm install -f
      
      - name: build
        run: npm run build
      
      - name: GH Pages deploy
        uses: Cecilapp/GitHub-Pages-deploy@3.1.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          email: abc@gmail.com
          build_dir: dist
          branch: gh-pages
```

此处使用的是`Cecilapp/GitHub-Pages-deploy`，一个已经写好的github action，通过简洁的配置能够快速进行发布到pages分支。

#### 第五步：设置Pages分支

在设置中，在`Setting`中设置Github Pages的source为`gh-pages`即可。

![image](https://user-images.githubusercontent.com/15191056/106869906-6f079080-670b-11eb-99c4-e5fc71656ff8.png)


至此，每次代码更新时，都会自动触发工作流，编译代码自动推送到`gh-pages`分支，从而更新Github Pages的页面。

### 实例：写一个属于自己的Action

我们可以将常用的重复操作过程封装成一个Action，在其他工作流中可以直接通过配置引用这个Action，加快工作流的开发速度。也可以发布到Github 的 Marketplace Actions中，供其他开发者使用。详见 https://github.com/marketplace?type=actions。

下面以一个自动创建Release的Action来了解如何创建和使用打包的 JavaScript 操作所需的基本组件。

#### 基本要求

开始之前，您需要下载 Node.js 并创建 GitHub 仓库。

1. 下载并安装 Node.js 12.x，其中包含 npm。

   https://nodejs.org/en/download/current/

2. 在 GitHub 上创建新仓库 您可以选择任何仓库名称或如本例一样使用 "auto-release"。 您可以在项目推送到 GitHub 之后添加这些文件。 更多信息请参阅“[创建新仓库](https://docs.github.com/cn/articles/creating-a-new-repository)”。

3. 将仓库克隆到计算机。 更多信息请参阅“[克隆仓库](https://docs.github.com/cn/articles/cloning-a-repository)”。

4. 从您的终端，将目录更改为新仓库。

   ```shell
   cd auto-release
   ```

5. 从您的终端，使用 `package.json` 文件初始化目录。

   ```shell
   npm init -y
   ```



#### 创建入口文件

使用以下示例代码在 `auto-release` 目录中创建新文件 `action.yml`。 更多信息请参阅“[GitHub Actions 的入口语法](https://docs.github.com/cn/actions/creating-actions/metadata-syntax-for-github-actions)”。

**action.yml**

```yaml
name: jardenliu/auto-release
description: Github Action for release auto creation
inputs:
    token:
        description: Github Token
        default: ${{ github.token }}
    name:
        description: release name
        required: true
    code:
        description: release code
        required: true
    body:
        description: release body context
        required: false
        default: ''
    prerelease:
        description: set release is prerelese or not
        required: false
        default: false
    recreate:
        description: recreate or not
        required: false
        default: false
    assets:
        description: recreate assets
        default: ''
        required: false

outputs:
    release:
        description: 'new release info'

runs:
    using: 'node12'
    main: 'dist/index.js'
```

此文件定义 多个参数的输入和 一个名为`release`输出。 它还告知操作运行程序如何开始运行此 JavaScript 操作。

#### 添加操作工具包

操作工具包是 Node.js 包的集合，可让您以更高的一致性快速构建 JavaScript 操作。

工具包 [`@actions/core`](https://github.com/actions/toolkit/tree/main/packages/core) 包提供一个接口，用于工作流程命令、输入和输出变量、退出状态以及调试消息。

工具包还提供 [`@actions/github`](https://github.com/actions/toolkit/tree/main/packages/github) 包，用于返回经验证的 Octokit REST 客户端和访问 GitHub 操作上下文。

工具包不止提供 `core` 和 `github` 包。 更多信息请参阅 [actions/toolkit](https://github.com/actions/toolkit) 仓库。

在您的终端，安装操作工具包 `core` 和 `github` 包。

```shell
npm install @actions/core
npm install @actions/github
```

现在，您应看到 `node_modules` 目录（包含您刚安装的模块）和 `package-lock.json` 文件（包含已安装模块的依赖项和每个已安装模块的版本）。

#### 编写操作代码

此操作使用工具包获取操作入口文件中所需的  输入变量，通过参数设置来实现自动`创建Release` 以及` 上传Asset`到Release的动作

GitHub 操作提供有关 web 挂钩实践、Git 引用、工作流程、操作和触发工作流程的人员的上下文信息。 要访问上下文信息，您可以使用 `github` 包。 您将编写的操作将打印 web 挂钩事件有效负载日志。

使用以下代码添加名为 `index.js` 的新文件。

```typescript
import * as core from '@actions/core'
import * as github from '@actions/github'
import { getAssetsFromInput, Ootokit } from './helpers'
import {
    deleteReleaseIfExists,
    createRelease,
    uploadReleaseAsset
} from './release'

const TOKEN = core.getInput('token')
const octoKit: Ootokit = github.getOctokit(TOKEN)

async function run(): Promise<void> {
    const name = core.getInput('name')
    const code = core.getInput('code')
    const body = core.getInput('body')
    const prerelease = core.getInput('prerelease') === 'true'
    const recreate = core.getInput('recreate') === 'true'
    const assets = getAssetsFromInput(core.getInput('assets'))

    if (recreate) {
        await deleteReleaseIfExists(octoKit, code)
    }

    let release = await createRelease(octoKit, {
        name,
        code,
        body,
        prerelease
    })

    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]
        await uploadReleaseAsset(octoKit, {
            ...asset,
            url: release.upload_url
        })
    }

    core.setOutput('release', JSON.stringify(release))
}

run().catch(e => {
    console.log(e)
    throw e
})
```



#### 创建自述文件

要让人们了解如何使用您的操作，您可以创建自述文件。 自述文件在您计划公开分享操作时最有用，但也是提醒您或您的团队如何使用该操作的绝佳方式。

在 auto-release 目录中，创建指定以下信息的 `README.md` 文件：

- 操作的详细描述。
- 必要的输入和输出变量。
- 可选的输入和输出变量。
- 操作使用的密码。
- 操作使用的环境变量。
- 如何在工作流程中使用操作的示例。

**README.md**

```markdown
# Auto cretae release action(自动创建发布)

## 输入参数
### token
**非必填** 操作github的token。默认值`${{ github.token }}`

### name
**必填** 发布的名称。

### code
**必填** 发布的code

### body
**非必填** 发布的内容。默认值为空

### prerelase
**非必填** 是否是预发布，默认值为false

### recreate
**非必填** 是否重新创建

### assets
**非必填** 需要上传到发布的assets文件


## 使用示例
​```
uses: jardenliu/auto-release@v0.1
with: 
    token: ${{github.token}}
    name: latest release
    code: latest
    prerelease: false
    recreate: true
    assets: >
      source.txt:target.txt:text/plain
      another.json:one.json:application/json
​```
```



#### 提交、标记和推送操作到 GitHub

GitHub 下载运行时在工作流程中运行的每个操作，并将其作为完整的代码包执行，然后才能使用 `run` 等工作流程命令与运行器机器交互。 这意味着您必须包含运行 JavaScript 代码所需的所有包依赖项。 您需要将工具包 `core` 和 `github` 包入到操作的仓库中。

> action不会进行npm install的操作，所以需要把用到node_module加入到仓库中。

检入 `node_modules` 目录可能会导致问题。 作为替代方法，您可以使用名为 [`@vercel/ncc`](https://github.com/vercel/ncc) 的工具将您的代码和模块编译到一个用于分发的文件中。

1. 通过在您的终端运行此命令来安装 `vercel/ncc`。 `npm i -g @vercel/ncc`

2. 编译您的 `index.js` 文件。 `ncc build index.js --license licenses.txt`

   您会看到一个新的 `dist/index.js` 文件，其中包含您的代码和编译的模块。 您还将看到随附的 `dist/licenses.txt` 文件，其中包含所用 `node_modules` 的所有许可证。

3. 在 `action.yml` 文件中更改 `main` 关键字以使用新的 `dist/index.js` 文件。 `main: 'dist/index.js'`

4. 如果已检入您的 `node_modules` 目录，请删除它。 `rm -rf node_modules/*`

5. 从您的终端，将更新提交到 `action.yml`、`dist/index.js` 和 `node_modules` 文件。

提交代码，并添加tag

```
git tag -a -m "My first action release" v1
git push --follow-tags
```

#### 

#### 在工作流程中测试您的操作

以下工作流程代码使用 `jardenliu/auto-release` 仓库中已完成的创建release的操作。 将工作流程代码复制到 `.github/workflows/main.yml` 文件中，但要将 `jardenliu/auto-release` 仓库替换为您创建的仓库。 您还可以将 `who-to-greet` 输入替换为您的名称。

**.github/workflows/main.yml**

```yaml
# This is a basic workflow to help you get started with Actions

name: CI

on:
  push:
    branches: [ master ]

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: release
        id: release
        uses: jardenliu/auto-release@main
        with:
            token: ${{github.token}}
            name: latest release
            code: latest
            prerelease: false
            recreate: true
            assets: >
              abc.txt:abc.txt:text/plain
```

