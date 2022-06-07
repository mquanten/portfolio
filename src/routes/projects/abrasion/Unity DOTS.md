 DOTS is a combination of new technologies. It requires the programmer to think about code and data using data-oriented design (_DoD_) as opposed to the usual object-oriented. This is important as it allows Unity and projects created in it to scale as technology does.

- Enables you to take advantage of multicore processors to parallelize data processing and increase performance.
- Currently exists and works alongside MonoBehaviours, eventually Unity will move to a full-DOTS implementation.

# What is DOTS?
Unity's __Data-Oriented Tech Stack__ (__DOTS__) is a combination of technologies that work together to deliver a data-oriented approact to coding in Unity. This allows you to build projects that are better suiterd to your target hardware and therefore more performant.

__DOTS__ consists of the following elements:
	1. The Entitity Component System (ECS), which provides the framework for coding using a Data-Oriented approact. This is distributed through the __Entities__ package.
	2. The C# Job System, which provides a simple method of generating multithreaded code. This is distributed through the __Jobs__ package.
	3. The Burst Compiler, which generates fast and optimized native code. Availible throguh the __Burst__ package.
	4. Native Containers, which are ECS data structures that provide control over memory.
1-3 are considered the __three pillars of DOTS__. Together the combine to form the foundation of delivering performant data-oriented solutions.

The common gateway to using DOTS is via ECS, ECS is a way to structure and write code that allows you to separate information from data. This allows you to arange data in a logical way that reduces the amount of cache misses by the CPU.

ECS provides an easy way to define how data is organised in memory and how it is accessed by the CPU. 

To improve performance:
	- The __ECS__ provides a data-oriented approach to coding. This means data structures are organized to avoid cache misses that subsequently make access to your data more effecient. 
	- The __C# Job System__ makes it easy to write fast, parellelized code in C# to fully utilise multicore processors.
	- The __Burst compiler__ produces highly optimized code that takes advantage of the platform hardware you are compiling for.

# How is data-oriented different from object-oriented?
Data-oriented design puts the emphasis of coding on solving problems by prioritizing and organizing your data to make access to it as efficient as possible. This contradicts the object-oriented principle that the design of code should be led by the model of the world you are creating.

## Object Oriented
The typical object-oriented workflow is to:
	1. Create a GameObject
	2. Add components to it
	3. Write MonoBehaviour scripts that change the properties of these components

At runtime, the GameObject is depndent on the references to the components. The script then has takes time to search for the component data which is scattered across the memory.

Code is generally structured based around the construction of things, their make up and then the deifnitions of what things do and how they interact wiht other things. This is an almos natural extension of how we create things in the real world. However this approach adds a layer of abstraction on top of the underlying data, which can distort how data is organised and an slow access to it. For example, if you want a function to operate on a different piece of data within an object, the function needs to either inherit from a parent class or be rewritten.

## Data Oriented
In this method of design you consider everything as data and not as objects. Doing this helps ensure that all data is easily accessible and can be used without hierarical class restrictions.

With a data-oriented approach the typical workflow is to identify and organise the data that underpins the most common tasks you want to implement. Your most common problems are the ones that you will need to solve the most often at runtime, so prioritizing these in your development is key. Organizing code around the data and the flow of that data means that access to it at runtime can be far more efficient than fetching data through multiple classes.

![OOP vs DOD](https://connect-prd-cdn.unity.com/20200629/learn/images/41b56919-e652-4a7b-abb6-0c796bd3b79b_1.1.3.png.1800x0x1.png)

# For Game Developers
- DOTS can help offload expensive operations in your game and improve performance, especially for repetitive processes.
- As games continue to evolve as does the increase of demands from hardware, it is sensible to prepare for the future by learning DOTS.
- DOTS can help you reach scale and performance you could not achieve before.
- DOTS provides better code control as the size of the project grows.
- If you can write code, you can work with DOTS. It is just a different approach to coding.

# Best Practices
## Understanding DOD
![An image explaining OOP vs DOD](https://connect-prd-cdn.unity.com/20210128/learn/images/17816c9a-48f8-45b3-93a8-3f01cba06a7d_unnamed__59_.png.1800x0x1.png)
> In OOP, the code iterates over an array of `Sphere` classes to check the `Color` of each one and set the `Position` of only the green ones. In DOD `Spheres` are decomposed into `Color` and `Position` components and packed into buffers resulting in fewer cache misses and mich faster processing. 

- You should be thinking of in terms of data and code to transform that data (in jobs scheduled from systems).

## Data Design
The best place to start is to figure out what data you actually need and what transformations you need your code to perform on the data to achieve the behaviour you want. For example, a a movement location and transforming it up or down based on player input.

The transformations should give you an idea of the read/write access patterns.

Use a worksheet [such as this](https://connect-prd-cdn.unity.com/20210129/e85c56d2-3c6a-4d77-8380-6fbaa426257d/Breakout%20Data%20Worksheet%20-%20Breakout.pdf?_ga=2.81724819.542213017.1654562666-1736554967.1654212677) to save time during the implementation of your application, it helps catch issues with the data design early and the design should make it quick and easy to figure out which components and systems you need to implement.