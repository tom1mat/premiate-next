import Head from 'next/head';

const PageTemplate = ({ children }) => (
  <>
    <Head>
      <base href="/" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="Premiate - nos encanta regalar cosas" />
      <meta name="author" content="Premiate" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Premiate</title>

      <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

      <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css" />
      <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
      <link href='https://fonts.googleapis.com/css?family=Kaushan+Script' rel='stylesheet' type='text/css' />
      <link href='https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet' type='text/css' />
      <link href='https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700' rel='stylesheet' type='text/css' />

      <link href="css/agency.css" rel="stylesheet" />
      <link href="css/more-styles.css" rel="stylesheet" />

      <script src="vendor/jquery/jquery.min.js"></script>
      <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="https://apis.google.com/js/platform.js" id="gapiScript"></script>
    </Head>
    {children}
  </>
);

export default PageTemplate;
