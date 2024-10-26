import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID!, // Get this from tina.io
  token: process.env.TINA_CONTENT_TOKEN!, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "content/posts/images",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: 'youtube',
                label: 'YouTube Link',
                match: {
                  start: '{{<',
                  end: '>}}',
                  name: 'youtube',
                },
                fields: [
                  {
                    name: '_value',
                    label: 'Video Id',
                    type: 'string',
                    required: true,
                  },
                ],
              },
              {
                name: 'twitter',
                label: 'Twitter Link',
                match: {
                  start: '{{<',
                  end: '>}}',
                  name: 'twitter',
                },
                fields: [
                  {
                    name: 'user',
                    label: 'Twitter Username',
                    type: 'string',
                    required: true,
                  },
                  {
                    name: 'id',
                    label: 'Tweet Id',
                    type: 'string',
                    required: true,
                  },
                ],
              },
              {
                name: 'figure',
                label: 'CDN Image',
                match: {
                  start: '{{<',
                  end: '>}}',
                  name: 'figure',
                },
                fields: [
                  {
                    name: 'src',
                    label: 'Image URL',
                    type: 'string',
                    required: true,
                  },
                  {
                    name: 'title',
                    label: 'Image Caption',
                    type: 'string',
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});