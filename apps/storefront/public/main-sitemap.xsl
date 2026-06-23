<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap — Tetrava Labs</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          body {
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            margin: 0;
            color: #475569;
            background: #f8fafc;
          }
          a { color: #0d9488; text-decoration: none; }
          a:hover { color: #0f766e; text-decoration: underline; }
          #description {
            background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
            padding: 32px 24px 24px;
            color: #fff;
          }
          #description h1 {
            margin: 0 0 12px;
            font-size: 2rem;
            font-weight: 600;
            letter-spacing: -0.02em;
          }
          #description p {
            margin: 8px 0 0;
            max-width: 720px;
            line-height: 1.6;
            font-size: 1rem;
          }
          #description a { color: #ccfbf1; border-bottom: 1px dotted #99f6e4; }
          #content {
            padding: 24px;
            max-width: 960px;
            margin: 0 auto;
          }
          .panel {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          }
          .expl { margin: 0 0 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
          th {
            background: #0d9488;
            color: #fff;
            text-align: left;
            padding: 14px 16px;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
          }
          tbody tr:nth-child(even) { background: #f8fafc; }
          .label { font-weight: 600; color: #0f172a; display: block; margin-bottom: 4px; }
          .path { font-size: 0.82rem; color: #94a3b8; word-break: break-all; }
          .count {
            display: inline-block;
            margin-bottom: 16px;
            padding: 6px 10px;
            border-radius: 999px;
            background: #ccfbf1;
            color: #0f766e;
            font-size: 0.85rem;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div id="description">
          <h1>XML Sitemap</h1>
          <p>
            This sitemap lists every public page on Tetrava Labs, grouped by pages, articles, products, and categories.
            Search engines use these files to discover and recrawl the site.
            <a href="https://www.sitemaps.org/" target="_blank" rel="noopener noreferrer">Learn about XML sitemaps</a>.
          </p>
        </div>

        <div id="content">
          <div class="panel">
            <xsl:choose>
              <xsl:when test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
                <div style="padding: 20px 20px 0;">
                  <span class="count">
                    <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemap groups
                  </span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th width="55%">Section</th>
                      <th width="45%">Last modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                      <tr>
                        <td>
                          <a class="label" href="{sitemap:loc}">
                            <xsl:call-template name="section-label">
                              <xsl:with-param name="loc" select="sitemap:loc"/>
                            </xsl:call-template>
                          </a>
                          <span class="path"><xsl:value-of select="sitemap:loc"/></span>
                        </td>
                        <td>
                          <xsl:call-template name="format-lastmod">
                            <xsl:with-param name="lastmod" select="sitemap:lastmod"/>
                          </xsl:call-template>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:when>
              <xsl:otherwise>
                <div style="padding: 20px 20px 0;">
                  <p class="expl">
                    <a href="/sitemap.xml">← Back to sitemap index</a>
                  </p>
                  <span class="count">
                    <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
                  </span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th width="75%">URL</th>
                      <th width="25%">Last modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                      <xsl:sort select="sitemap:loc"/>
                      <tr>
                        <td>
                          <a class="label" href="{sitemap:loc}">
                            <xsl:call-template name="url-label">
                              <xsl:with-param name="loc" select="sitemap:loc"/>
                            </xsl:call-template>
                          </a>
                          <span class="path"><xsl:value-of select="sitemap:loc"/></span>
                        </td>
                        <td>
                          <xsl:call-template name="format-lastmod">
                            <xsl:with-param name="lastmod" select="sitemap:lastmod"/>
                          </xsl:call-template>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template name="section-label">
    <xsl:param name="loc"/>
    <xsl:choose>
      <xsl:when test="contains($loc, 'post-sitemap')">Articles</xsl:when>
      <xsl:when test="contains($loc, 'page-sitemap')">Pages</xsl:when>
      <xsl:when test="contains($loc, 'product-sitemap')">Products</xsl:when>
      <xsl:when test="contains($loc, 'category-sitemap')">Categories</xsl:when>
      <xsl:otherwise>Sitemap</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="url-label">
    <xsl:param name="loc"/>
    <xsl:variable name="path" select="substring-after($loc, '://')"/>
    <xsl:variable name="pathOnly" select="substring-after($path, '/')"/>
    <xsl:choose>
      <xsl:when test="$pathOnly = ''">Home</xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$pathOnly"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="format-lastmod">
    <xsl:param name="lastmod"/>
    <xsl:if test="$lastmod != ''">
      <xsl:value-of select="concat(substring($lastmod, 1, 10), ' ', substring($lastmod, 12, 5), ' UTC')"/>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
