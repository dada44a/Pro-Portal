import { CardBody, Card, CardTitle } from '#/components/Card'
import { useAuth } from '#/context/AuthContext';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useLocalMutation, useLocalQuery } from '#/hooks/UseLocalQuery';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
}

function RouteComponent() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isError: authError, logout } = useAuth();
  const { data: favouritesData, isLoading: favouritesLoading, refetch: refetchFavourites } = useLocalQuery({
    url: "/favourites",
    queryKey: ["favourites"],
  });

  const addFavouriteMutation = useLocalMutation({
    onSuccess: (message) => {
      toast.success(message || "Added to favourites");
      refetchFavourites();
    },
    onError: (error) => toast.error(error),
  });

  const removeFavouriteMutation = useLocalMutation({
    onSuccess: (message) => {
      toast.success(message || "Removed from favourites");
      refetchFavourites();
    },
    onError: (error) => toast.error(error),
  });



  // Fetch all properties
  const { data: propertiesData, isLoading: propertiesLoading } = useLocalQuery({
    url: "/property",
    queryKey: ["properties"],
  });

  // Fetch favourites


  const handleAddFavourite = (propertyId: number) => {
    addFavouriteMutation.mutate({
      url: "/favourites",
      method: "POST",
      data: { propertyId },
    });
  };

  const handleRemoveFavourite = (propertyId: number) => {
    removeFavouriteMutation.mutate({
      url: `/favourites/${propertyId}`,
      method: "DELETE",
      data: {},
    });
  };

  useEffect(() => {
    if (!authLoading && (authError || !user)) {
      navigate({ to: "/" });
    }
  }, [authLoading, authError, user, navigate]);

  if (authLoading || propertiesLoading || favouritesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-4">Loading Dashboard...</p>
      </div>
    );
  }

  if (authError || !user) {
    return null;
  }

  const properties: Property[] = propertiesData?.properties || [];
  const favouriteIds: number[] = favouritesData?.favouriteProperties || [];
  const favouriteProperties = properties.filter(p => favouriteIds.includes(p.id));

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm px-10">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Pro Portal</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="p-10">
        {/* info div */}
        <div className="md:grid-cols-2 lg:grid-cols-3 grid gap-6">
          <Card className="bg-primary/5">
            <CardBody>
              <CardTitle title="Welcome" className="text-xl font-bold" />
              <p className="text-2xl font-semibold text-primary">{user.username}</p>
              <p className="text-sm opacity-70">{user.email}</p>
            </CardBody>
          </Card>

          <Card className="bg-secondary/5">
            <CardBody>
              <CardTitle title="Role" className="text-xl font-bold" />
              <p className="text-2xl font-semibold text-secondary">{user.role}</p>
            </CardBody>
          </Card>

          <Card className="bg-accent/5">
            <CardBody>
              <CardTitle title="Total Favourites" className="text-xl font-bold" />
              <p className="text-2xl font-semibold text-accent">{favouriteIds.length}</p>
            </CardBody>
          </Card>
        </div>

        {/* available properties */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 ml-2">Available Properties</h2>
          <div className="md:grid-cols-2 lg:grid-cols-3 grid gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">{property.name}</p>
                    {!favouriteIds.includes(property.id) && (
                      <button
                        className="btn btn-circle btn-sm btn-ghost text-2xl"
                        onClick={() => handleAddFavourite(property.id)}
                      >
                        +
                      </button>
                    )}
                  </div>
                  <p className="opacity-70">{property.location}</p>
                  <p className="text-secondary font-semibold mt-2">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR' }).format(property.price)}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* favourite properties */}
        {favouriteProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 ml-2">Your Favourite Properties</h2>
            <div className="md:grid-cols-2 lg:grid-cols-3 grid gap-6">
              {favouriteProperties.map((property) => (
                <Card key={`fav-${property.id}`} className="hover:shadow-md transition-shadow bg-base-200/50">
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">{property.name}</p>
                      <button
                        className="btn btn-circle btn-sm btn-ghost text-2xl text-error"
                        onClick={() => handleRemoveFavourite(property.id)}
                      >
                        -
                      </button>
                    </div>
                    <p className="opacity-70">{property.location}</p>
                    <p className="text-secondary font-semibold mt-2">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR' }).format(property.price)}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}



