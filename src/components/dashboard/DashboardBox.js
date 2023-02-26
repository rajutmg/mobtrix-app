import React from 'react'
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

const DashboardBox = () => {
  return (
        <Grid container spacing={3}>

      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Project
            </Typography>
            <Typography variant="h5" component="h2">
              Some Project
            </Typography>
            
            <Typography variant="body2" component="p">
              well meaning and kindly.
            </Typography>
          
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Project
            </Typography>
            <Typography variant="h5" component="h2">
              Fantasy Football
            </Typography>
            
            <Typography variant="body2" component="p">
              well meaning and kindly.
            </Typography>
          
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DashboardBox