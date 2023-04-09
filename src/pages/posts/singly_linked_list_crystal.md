---
layout: "../../layouts/MarkdownLayout.astro"
title: how to singly linked list??? (in Crystal)
author: pes18fan
description: "What the hell is a singly linked list and how the hell do I make it!!???!!"
image:
  url: "https://images.pexels.com/photos/2696299/pexels-photo-2696299.jpeg?cs=tinysrgb&w=600&h=600"
  alt: "Confused and stressed person with hands on his head looking at a laptop"
pubDate: 2023-4-9
---

# how to singly linked list??? (in Crystal)

So recently, I found this awesome video by [Low Level Learning](https://www.youtube.com/@LowLevelLearning) where he speaks on singly linked lists ([the video](https://www.youtube.com/watch?v=dti0F7w3yOQ)). With my terrible, or should I say, almost non-existent knowledge of data structures, I decided to follow the video to learn about one of them. The code in the video was written in C, however I wanted to be ✨*different*✨ and to use another language. I picked Crystal, mainly because:

- \- I wanted to use a different language, as I said, so that I don't end up just copy pasting everything into C.
- \- Rust was an alternative but I'm really not good at it at all.
- \- I like Crystal and have used it before.

This was the start of a very interesting journey (should I even call it journey? It was done in a few hours, after all...). Well, in either case, I'll recap what happened here. While the code might be in Crystal, I'll be trying to explain it in a language-agnostic way, so I hope this helps other people to learn a bit about how singly linked lists (I'll call them SLLs from here since the phrase is too long) work.

## humble beginnings

Everything began with the definition of a `struct` for a node. In a SLL, every item is called a node, which each has a pointer to the next item in the list. This was fairly straightforward:

```crystal
struct Node
  property nxt, data

  def initialize(@nxt : Pointer(Node)?, @data : Int32)
  end
end
```

I had to name the variable for the next node's pointer as `nxt` since `next` is a reserved keyword in Crystal.

The next thing to do was to create a variable that holds the head of the SLL. The head is a pointer which points to the first node in the list. This is not specific to a node, so it had to be global; however the problem is that Crystal doesn't have global variables, at least not directly. So, I created a module with a class variable (represented by `@@` at the front) which are variables of a class or module itself instead of instances.

```crystal
module Globals
  extend self

  @@head : Pointer(Node)? = nil

  def head
    @@head
  end

  def set_head(value : Pointer(Node)?)
    @@head = value
  end
end
```

I also created a `set_head` method so as to change the value of `head` from outside the class.

## user interface

Now that the basics were done, the next thing to do was to create a simple UI for the user to figure out how to work with the list.

```crystal
def print_menu
  puts "You have the following options."
  puts "\t1. To add a node to the list."
  puts "\t2. To remove a node from the list."
  puts "\t3. Insert a node between two nodes in the list."
  puts "\t4. Print your list."
  puts "\t5. Quit."
end
```

Super simple, nothing too fancy.

I next created the handlers for the options:

```crystal
option = -1

while option != 5
  print_menu
  option = gets(chomp: true).to_s.to_i

  if option > 0 && option <= 5
    case option
    when 1
      # add operation
    when 2
      # remove operation
    when 3
      # insert operation
    when 5
      # do nothing
    end
  end
end
```

## functions

Time for the functions. Three functions were implemented in the video, and I'll go over each one.

### adding a node

Let's begin with the function to add a node.

To add a node, we could go in two directions. One would be to add the node to the back, but in that case we'd have to traverse the whole list to find where the list ends, which makes the time complexity `O(n)`. That would cause the program to slow down a lot if there are many elements. Thus, it's a better idea to add to the front, which will provide a constant time complexity of `O(1)`. For this, we first allocate the memory for a new node, then check for two edge cases as follows:

-   If the list is empty, i.e. `head` is `null` or in the case of Crystal, `nil`, make the head point to the new node instead.
-   If the list is not empty, i.e. `head` already points to some node, make the new node pointer point to that node, and then make `head` point to the new one.

All that can be implemented in a function as follows:

```crystal
# add a node to the list
def add_node(data : Int32) : Pointer(Node)?
  new : Pointer(Node)? = nil

  # two cases:
  # if the list is empty
  if Globals.head == nil
    new = Pointer(Node).malloc(sizeof(Node))

    return nil if new == nil

    # set the head to point to the new node
    new.value.data = data
    Globals.set_head(new)
    new.value.nxt = nil
    # if list is not empty
  else
    new = Pointer(Node).malloc(sizeof(Node))

    return nil if new == nil

    # set the new node pointer to point to the existing head, then make the head point to it
    new.value.data = data
    new.value.nxt = Globals.head
    Globals.set_head(new)
  end

  return new
end
```

We then add the necessary code into the `case` handler to run the function via the UI.

```crystal
# ...
when 1
  # add operation
  puts "What data should I insert?"
  data_to_insert = uninitialized Int32

  loop do
    begin
      data_to_insert = gets(chomp: true).to_s.to_i
    rescue
      puts "Data must be a 32-bit integer. Try again!"
    else
      break
    end
  end

  new : Pointer(Node)? = add_node(data_to_insert)
when 2
# ...
```

Note the use of the `loop` and the `begin` block. I did that in order to handle cases when a non-integer value was inputted, otherwise the program would just crash.

Easy!

### removing a node

Next, removing a node.

To remove a node, we need to remove the link that the previous node has with it. We need to make it so that the link points to the element after the one that we are removing, effectively making the node inaccessible. After that, we free the memory of that node.

In code, it would be implemented as such:

```crystal
# remove a node from the list
def remove_node(data : Int32) : Int32
  # set current and previous nodes as head
  current : Pointer(Node)? = Globals.head
  prev : Pointer(Node)? = Globals.head

  # loop while the current and previous nodes are not nil
  while current && prev
    if current.value.data == data
      # if current node is the list head
      if current == Globals.head
        Globals.set_head(current.value.nxt)
        # if current node is not list head
      else
        prev.value.nxt = current.value.nxt
        # free the memory for current at this point
      end

      return 0 # found the element
    end

    # move each pointer to their next one after every iteration
    prev = current
    current = current.value.nxt
  end

  return 1 # element not found
end
```

This function returns a 0 if the node was found and removed, and returns 1 if it wasn't found. This helps in handling of the function.

Do note that if you're using C or any other language without a garbage collector, you need to free the memory for the removed node to prevent a memory leak. Crystal has a garbage collector, so that's not necessary here.

We then create the handler for the function:

```crystal
# ...
when 2
  # remove operation
  puts "What data should I remove?"
  data_to_remove = uninitialized Int32

  loop do
    begin
      data_to_remove = gets(chomp: true).to_s.to_i
    rescue
      puts "Data must be a 32-bit integer. Try again!"
    else
      break
    end
  end

  return_value = remove_node(data_to_remove)

  if return_value == 1
    puts "Element not found"
  end
when 3
# ...
```

That's it!

### inserting a node

By inserting a node, we mean putting a node in between two existing ones.

Let's call the new node N. Say, that the linked list we currently have has three nodes A, B and C with indexes 0, 1 and 2 as such:

```
A:0 -> B:1 -> C:2
```

If N is going to be inserted at position 1, we will insert it in front of B, and then cut the current link between B and C such that the list becomes this:

```
A:0 -> B:1 -> N:2 -> C:3
```

This would be implemented in code as follows:

```crystal
# insert a node to a position in the list
def insert_node(data : Int32, position : Int32) : Pointer(Node)?
  # set head as current node
  current = Globals.head

  # check if the position is too far into the list
  while current && position != 0
    position -= 1
    current = current.value.nxt
  end

  if position != 0
    puts "Requested position is too far into the list"
    return nil
  end

  # if the position is in the list, continue as such:
  new : Pointer(Node)? = Pointer(Node).malloc(sizeof(Node))

  return nil if new == nil

  if current
    new.value.data = data
    new.value.nxt = current.value.nxt
    current.value.nxt = new
  end

  return new
end
```

We return the new node if the insertion succeeded, and return `nil` if it didn't, possibly because of the position being too high.

We handle the function as follows:

```crystal
# ...
when 3
  # insert operation
  puts "What data should I insert?"
  data_to_insert = uninitialized Int32
  position = uninitialized Int32

  loop do
    begin
      data_to_insert = gets(chomp: true).to_s.to_i
    rescue
      puts "Data must be a 32-bit integer. Try again!"
    else
      break
    end
  end

  puts "What position?"
  loop do
    begin
      position = gets(chomp: true).to_s.to_i
    rescue
      puts "Position must be a 32-bit integer. Try again!"
    else
      break
    end
  end

  new = insert_node(data_to_insert, position)

  if new == nil
    puts "Failed to insert into list."
  end
when 4
# ...
```
And we're done!

### printing the list

Don't forget to do this! For this, simply loop over the list and print each node's data.

```crystal
# print out the list
def print_list
  current : Pointer(Node)? = Globals.head

  while current
    print "#{current.value.data}->"
    current = current.value.nxt
  end

  puts ""
end
```

Handle it in the `case` block:

```crystal
when 4
  # print the list
  print_list
 when 5
```

And we're done! Run the program and check out this fancy new data structure you've just learned about.