---
title: React-Live & Code example
date: '2019-05-26'
tags: ['js', 'code', 'react']
cover: './preview.jpg'
---

There are a few cases where it might make sense to modify the “back” button’s behavior. For example, if you build a page where you choose something, then see an “are you sure?” page to make sure it’s what you really wanted, and finally see a confirmation page, it may be desirable to skip the “are you sure?” page if the “back” button is clicked.

No! I was ashamed to be SEEN with you. I like being with you. There’s so many poorly chosen words in that sentence. No… but I’d like to be asked! Whoa, this guy’s straight?

There’s so many poorly chosen words in that sentence. Now, when you do this without getting punched in the chest, you’ll have more fun. No… but I’d like to be asked! There’s only one man I’ve ever called a coward, and that’s Brian Doyle Murray. No, what I’m calling you is a television actor.

```js
<PostDetails className="post_details">
  <PostMeta>
    {tags == null || overlay == true ? null : (
      <PostTags className="post_tags">
        {tags.map((tag: string, index: number) => (
          <Link key={index} to={`/tags/${_.kebabCase(tag)}/`}>
            {`#${tag}`}
          </Link>
        ))}
      </PostTags>
    )}
  </PostMeta>

  <PostTitle className="post_title">
    <Link to={url}>{title}</Link>
  </PostTitle>
  {overlay == true ? (
    ''
  ) : (
    <>
      {' '}
      {description && (
        <Excerpt
          dangerouslySetInnerHTML={{
            __html: description,
          }}
          className="excerpt"
        />
      )}
    </>
  )}

  <ReadMore className="read_more">
    <Link to={url}>{overlay == true ? 'Read Story' : 'Read More'}</Link>
  </ReadMore>
</PostDetails>
```

I’m nobody’s taxi service; I’m not gonna be there to catch you every time you feel like jumping out of a spaceship. Sorry, checking all the water in this area; there’s an escaped fish. It’s art! A statement on modern society, ‘Oh Ain’t Modern Society Awful?’!

It’s art! A statement on modern society, ‘Oh Ain’t Modern Society Awful?’! Did I mention we have comfy chairs? Did I mention we have comfy chairs? All I’ve got to do is pass as an ordinary human being. Simple. What could possibly go wrong?
