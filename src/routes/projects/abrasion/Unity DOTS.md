---
date: 07.06.22
tags: computing/development/games/unity/dots
---
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

### Designing for Efficient Transformation
You should arrange data in a way that maximizes efficient access to them. When a CPU is processing data and finds it already in a cache line, it is accessed very fast. This is a chace hit. When the data is not in a cache line, that's called a cache miss, and causes the CPU to have to wait a long time to fetch the data from main memory.

This means forgetting about Dictionaries and linked lists as they involve a huge amoutn of random memory access, resilting in many cache misses. Instead think in terms of simple, predictable, linear data structures: arrays and lists (or rather, NativeArray and NativeList).

ECS stores component data in arrays packed inside chunks. It's efficient to process a whole chunk of components at once because it maximizes CPU cache hits. 

Often the best waya to achieve fine-grained EntityQueries is to construct entites from a large number of small components to get fine-grained control over entity archetypes rather ahn to construct a smaller number of large components. Additionally, smaller components result in much more efficient use of the CPU cache.

An example would be a component for the ball in the Breakout example. It might be tempting to keep all of the data in one component like you would in OOP if you were creating a "ball" class:

``` C#
public struct Ball: IComponentData
{
	public float2 Position;
	public float2 Direction; 
	public float Speed; 
	public float2 Size;
	// etc
}
```

This is fine if all of the systems that process __Ball__ components access every pieve of this data. However different systems operate on different subsets of data. For example the rendering system only needs the __Position__ and __Size__, yet all the data will be packing into the cache whenever just one of the variables is needed, filling the cache with data which isn't being used.

If your data design keeps all of the data in separate components, the Rendering system can have a cache line that accesses packed __Position__ components, and another cache line that accesses packed __Size__ components, and then it does work on all of the content of those caches.

### What's Blittable and Burstable
Traditional OOP techniques confie most code to the main thread, meaning you only use a fraction of the potential processing power of modern CPUs.

The C# Job System makes it much easier to write multithreaded code without race conditions because it contains a safety system which effectivle bans code that would allow race conditions to occur. To ensure the check for potential race conditions is efficient, you can only create jobs that operate on blittable data types. Blittable data is data that can be copied into memory from disk or another part of memory, in a single block copy operation, with no need to fix broked references once it has been copied. That means no pointer/reference fix-up, no classes, references, nothing that lives on the managed heap. You should design your data using simple types like int, float, bool, etc and structs containing only those types.

The other major advantage is Burst can compile jobs, which results in highly-optimize native code. You can apply the Burst compiler to all jobs you write in [High Performance C#](https://blog.unity.com/technology/on-dots-c-c). 

### Is the Data Read Only?
Data that is used as an input and not modified as an output should be declared as such: 

``` C#
public readonly int jumpSpeed;
public const int jumpSpeed;
```

This allows the Job Scheduler to safely parallelize the jobs that process it. This in turn gives the schedulre more options to figure out how to arrange scheduled jobs.

If your data design worksheet shows data that is read-only in every transformation, the data shouldn't be in a component, ideally it should be in a [BlobAsset](https://docs.unity3d.com/Packages/com.unity.entities@0.50/api/Unity.Entities.BlobBuilder.html). An immutable data structure which can contain blittable data, as well as structs and arrays of blittable data and strings in the form of `BlobString`.  As they are stored in binary format they can be deserialized much quicker than OOP assets.

### Most Common use-cases
Structure the data to make the most common operations have the most efficient access. For example you should prioritse the efficiency of the operations that happen 100,000 times a fram over those that happen once per frame.

This means you should plan EntityQueries well.

### Don't use strings
The Job System and Burst support a number of primitive types, support for __char__ is due in the future. Strings are very inefficient data types for most purposes. They are generally only useful for UI displays, file names and paths for loading or saving, and for debugging.

## Implementation fundamentals
It's useful to keep the __Unity CPU Profile__ and the __Console window__ open and visible. 

### Seperate data from systems
There should be no methods in components and no data in systems.

### Avoid static data for faster iteration times.
> [!NOTE] Enable Play Mode Options
> This will start play mode faster.

### Declare write access correctly in Entities.ForEach() and jobs

# Packages
Below is a list of packages that are a good base for DOTS based 2D projects, obviously you would swap out the 2D packages for the ones in the 3D templates.
![Package List](Screenshot%202022-06-08%20at%2000.56.38.png)